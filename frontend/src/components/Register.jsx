import React, {useState} from "react";
import axios from "axios";

function RegistrationForm(){
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email:""
    });

    function handleChange(event){
        setFormData({  ...formData, [event.target.name]: event.target.value})
    }

    async function handleSubmit(event){
        event.preventDefault();
        try{
            const response = await axios.post("http://localhost:3000/api/register", formData);
            console.log(response.data);
        }catch(error){
            console.log("Registration Failed", error);
        }
    }

    return(
        <form>
            <label>
                Username: 
                <input type="text" name="username" onChange={handleChange} value={formData.username} placeholder="Username"/>
            </label>
            <label>
                Password:
                <input type="password" name="password" onChange={handleChange} value={formData.password} placeholder="Password" />
            </label>
            <label>
                Email:
                <input type="email" name="email" onChange={handleChange} value={formData.email} placeholder="Email" />
            </label>
        </form>
    )
}

