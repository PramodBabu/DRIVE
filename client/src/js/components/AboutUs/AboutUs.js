import React from 'react';

const AboutUs = () => {

    return (
        <div className="container d-flex justify-content-center mt-5">
            <div 
                style={{
                    // backgroundColor: 'aliceblue',
                    // border: '1px solid black',
                    // borderRadius: '15px'
                }}
                className="col-md-9 p-2"
            >
                <h2>
                    About Us 
                </h2>
                <p class="lead">
                Marz Ecom LLC provides eCommerce sellers with a single solution to ship their orders worldwide.
                We are the first company to provide an end-to-end infrastructure that connects sellers directly to DHL, FedEx, TNT, UPS and over 250 shipping options.
                Our logistics experience in eCommerce has allowed us to act as an expert in international shipping to every country around the globe.
                </p>
            </div>
        </div>
    );
}

export default AboutUs;