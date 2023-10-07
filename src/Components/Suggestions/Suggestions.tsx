import React from 'react'
import "./Suggestions.css"

function Suggestions() {
    return (


        <div className="container-fluid">


            <div className="people">
                <h5 className='mt-md-4 mb-md-5'>Suggested for you</h5>
                

                <div className="cardk row col-md-12 col-xs-12" style={{ width: '100%' }}>
                    <div className="d-flex align-items-center col-md-8 col-xs-8">
                        <img
                            src="https://w7.pngwing.com/pngs/129/292/png-transparent-female-avatar-girl-face-woman-user-flat-classy-users-icon.png"
                            className="card-img-top"
                            alt="..."
                        />
                        <p style={{fontWeight:'bold',marginLeft:'15px'}}>  Name</p>
                    </div>
                    <div className="col-md-4 col-xs-4 d-flex justify-content-end align-items-center">
                        {/* <button>Follow</button> */}
                        <h6>Follow</h6>
                    </div>
                </div>


                <div className="cardk row col-md-12 col-xs-12" style={{ width: '100%' }}>
                    <div className="d-flex align-items-center col-md-8 col-xs-8">
                        <img
                            src="https://w7.pngwing.com/pngs/129/292/png-transparent-female-avatar-girl-face-woman-user-flat-classy-users-icon.png"
                            className="card-img-top"
                            alt="..."
                        />
                        <p style={{fontWeight:'bold',marginLeft:'15px'}}> Name</p>
                    </div>
                    <div className="col-md-4 col-xs-4 d-flex justify-content-end align-items-center">
                        <button>Follow</button>
                    </div>
                </div>



                <div className="cardk row col-md-12 col-xs-12" style={{ width: '100%' }}>
                    <div className="d-flex align-items-center col-md-8 col-xs-8">
                        <img
                            src="https://w7.pngwing.com/pngs/129/292/png-transparent-female-avatar-girl-face-woman-user-flat-classy-users-icon.png"
                            className="card-img-top"
                            alt="..."
                        />
                        <p style={{fontWeight:'bold',marginLeft:'15px'}}> Name</p>
                    </div>
                    <div className="col-md-4 col-xs-4 d-flex justify-content-end align-items-center">
                        <button>Follow</button>
                    </div>
                </div>

            </div>
        </div>



    )
}

export default Suggestions
