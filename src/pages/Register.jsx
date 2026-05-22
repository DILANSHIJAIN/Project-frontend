import { useState } from "react";

export const Register=()=> {

    const [user,setUser]=useState({
        username:"",
        email:"",
        phone:"",
        password:"",

    });

    const handleInput=(e)=>{
        console.log(e);
        let name=e.target.name;
        let value=e.target.value;

        setUser({
            ...user,
            [name]:value,
        })
    };

    const handleSubmit=(e)=>{
        e.preventDefault();
        console.log(user);
    }

    return <>
    <section>
        <main>
            <div className="section-registration">
                <div className="container grid grid-two-cols">
                    <div className="registration-image">
                        <img src="/images/registerpic.png" alt="A girl is trying to do registration" 
                        width="500"
                        height="500"
                        />
                    </div>

                    {/* regitration form */}
                    <div className="registration-form">
                        <h1 className="main-heading mb-3">registration form</h1>
                        <br />
                        <form onSubmit={handleSubmit} >

                            <div>
                                <label htmlFor="username">username</label>
                                <input 
                                type="text"
                                name="username"
                                placeholder="Enter Your Username"
                                id="username"
                                required
                                autoComplete="off"
                                value={user.username}
                                onChange={handleInput}
                                />
                            </div>

                             <div>
                                <label htmlFor="email">email</label>
                                <input 
                                type="email"
                                name="email"
                                placeholder="Enter Your Email"
                                id="email"
                                required
                                autoComplete="off"
                                value={user.email}
                                onChange={handleInput}
                                />
                            </div>

                            
                             <div>
                                <label htmlFor="phone">phone</label>
                                <input 
                                type="number"
                                name="phone"
                                placeholder="Enter Your phone"
                                id="phone"
                                required
                                autoComplete="off"
                                value={user.phone}
                                onChange={handleInput}
                                />
                            </div>

                            
                             <div>
                                <label htmlFor="password">password</label>
                                <input 
                                type="password"
                                name="password"
                                placeholder="Enter Your password"
                                id="password"
                                required
                                autoComplete="off"
                                value={user.password}
                                onChange={handleInput}
                                />
                            </div>
                            <br />

                            <button type="submit" className="btn btn-submit">Register Now</button>






                        </form>

                    </div>




                </div>
            </div>
        </main>
    </section>
    </>
};