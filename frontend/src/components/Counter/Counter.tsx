import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
// import counterStore from '@/store/counterStore';
import { StoreContext } from '@/store/storeContext';


const Counter = observer(() => {
    const mainStore = useContext(StoreContext);
    return (
        <div>
            <p>Count: {mainStore.count}</p>
            <button onClick={mainStore.increment}>+</button>
            <button onClick={mainStore.decrement}>-</button>
        </div>
    );
});

export default Counter;
