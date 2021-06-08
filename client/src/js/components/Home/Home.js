import React from 'react';

const Home = () => {

    return (
        <div className="container-fluid d-flex justify-content-center mt-5">
            <div 
                style={{
                    backgroundColor: 'aliceblue',
                    border: '1px solid black',
                    borderRadius: '15px'
                }}
                className="col-md-9 p-2"
            >
                Scrolling DIV
            </div>
        </div>
    );
}

export default Home;