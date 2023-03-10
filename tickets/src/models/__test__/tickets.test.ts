import { Ticket } from "../tickets";

it('implement optimistic concurrency control', async () => {
    // create an instance of a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        userId: '2332'
    });

    // save the tickeet to the database
    await ticket.save();

    // fetch the ticket twice
    const firstInstance = await Ticket.findById(ticket.id);

    const secondInstance = await Ticket.findById(ticket.id);

    // make two separate change  to the tickets we fetched
    firstInstance!.set({  price: 10 });
    secondInstance!.set({ price: 15 });

    // save the first fetched ticket
    await firstInstance?.save();

    //save the second fetched ticket and expect the error
    try{
    await secondInstance?.save();
    }catch(err){
        return;
    }

    throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        userId: '123'
    })

    await ticket.save();
    expect(ticket.version).toEqual(0)
    await ticket.save();
    expect(ticket.version).toEqual(1)
    await ticket.save();
    expect(ticket.version).toEqual(2)
    
})