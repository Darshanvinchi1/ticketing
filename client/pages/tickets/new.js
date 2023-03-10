import { useState } from "react";
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const NewTicket = () =>{
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const { doRequest, errors } = useRequest({
        url:'/api/tickets',
        method: 'post',
        body:{
             title,price
        },
        onSuccess: () => Router.push('/')
    })

    const onSubmit = (event) => {
        event.preventDefault();

        doRequest();
    }

    const onBlur = () => {
        const value = parseFloat(price);

        if(isNaN(value)){
            return;
        }

        setPrice(value.toFixed(2));
    }
    return <div>
        <h1>Create A ticket</h1>
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <lable>Title</lable>
                <input value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" />
            </div>
            <div className="form-group">
                <label>Price</label>
                <input value={price} onBlur={onBlur} onChange={(e) => setPrice(e.target.value)} className="form-control" />
            </div>
            {errors}
            <button className="btn btn-primary" style={{marginTop:'10px'}}>Submit</button>
        </form>
        </div>;
}

export default NewTicket;