import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/tickets";

it('return a 404 if the provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie',global.signin())
        .send({
            title:'sasda',
            price:20
        })
        .expect(404);

});
it('return a 401 if the user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title:'sasda',
            price:20
        })
        .expect(401);
});
it('return a 401 if the user does not own the ticket', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie',global.signin())
        .send({
            title: 'sadsdff',
            price: 20
        });

        await request(app)
            .put(`/api/tickets/${response.body.id}`)
            .set('Cookie',global.signin())
            .send({
                title: 'dsfdf',
                price:20
            })
            .expect(401)
});
it('return a 400 if the user provided invalid title or price', async () => {
    const cookie =  global.signin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie',cookie)
        .send({
            title: 'sadsdff',
            price: 20
        });
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',cookie)
        .send({
            title: '',
            price: 20
        })
        .expect(400);
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',cookie)
        .send({
            title: 'safdsf',
            price: -20
        })
        .expect(400);
});

it('updated the tickets provided vaild inputs', async () => {
    const cookie =  global.signin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie',cookie)
        .send({
            title: 'sadsdff',
            price: 20
        });
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',cookie)
        .send({
            title: 'new title',
            price: 100
        })
        .expect(200);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send();

    expect(ticketResponse.body.title).toEqual('new title');
    expect(ticketResponse.body.price).toEqual(100);
});

it('publishes an event', async () => {
    const cookie =  global.signin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie',cookie)
        .send({
            title: 'sadsdff',
            price: 20
        });
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',cookie)
        .send({
            title: 'new title',
            price: 100
        })
        .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})

it('rejects updated if the ticket is reserved',async () => {
    const cookie =  global.signin();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie',cookie)
        .send({
            title: 'sadsdff',
            price: 20
        });
    
    const ticket = await Ticket.findById(response.body.id);
    ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
    await ticket!.save()

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',cookie)
        .send({
            title: 'new title',
            price: 100
        })
        .expect(400);
});