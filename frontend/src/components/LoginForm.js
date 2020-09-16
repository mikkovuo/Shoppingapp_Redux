import React from 'react';
import {Form,Button} from 'semantic-ui-react';
import {connect} from 'react-redux';
import {register,login} from '../actions/loginActions';

class LoginForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }

    onChange = (event) => {
        let state = {};
        state[event.target.name] = event.target.value;
        this.setState(state);
    }

    onSubmit = (event) => {
        if(this.state.username.length < 4 || this.state.password.length < 8){
            alert('username or password too short');
            return
        }
        let user = {
            username: this.state.username,
            password: this.state.password
        }
        if(event.target.name === 'register'){
            this.props.dispatch(register(user));
        }else {
            this.props.dispatch(login(user));
        }
    }

    render(){
        return (
            <Form>
                <Form.Field>
                    <label htmlFor = "username">Username:</label>
                    <input type = 'text' onChange={this.onChange} name = 'username' value={this.state.username} />
                </Form.Field>
                <Form.Field>
                    <label htmlFor = "password">Password:</label>
                    <input type = 'password' onChange={this.onChange} name = 'password' value={this.state.password} />
                </Form.Field>
                <Button onClick={this.onSubmit} name='register'>Register</Button>
                <Button onClick={this.onSubmit} name='login'>Login</Button>
            </Form>
        )
    }

}

export default connect()(LoginForm);