import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from '../components/Login'
import { createMount, createShallow } from '@material-ui/core/test-utils'
import Dialog from '@material-ui/core/Dialog';
import { shallow } from '../enzyme';

import { GoogleLoginButton } from "react-social-login-buttons";
import { TwitterLoginButton } from "react-social-login-buttons";
import { GithubLoginButton } from "react-social-login-buttons";
import { FacebookLoginButton } from "react-social-login-buttons";

describe('Login Page Tests', () => {
  let shallow;
  let mount;

  beforeAll(() => {
    mount = createMount();
    shallow = createShallow();
  });

  afterAll(() => {
    mount.cleanUp();
  })

  it ('Login button rendered', () => {
    const wrapper = mount(<Router><Login/></Router>);
    const loginButton = wrapper.findWhere(n => n.type() === 'button' && n.text() === 'LOGIN');
    expect(loginButton.exists()).toBe(true);
  })

  it ('Forgot button rendered', () => {
    const wrapper = mount(<Router><Login/></Router>);
    const forgotButton = wrapper.findWhere(n => n.type() === 'button' && n.text() === 'Forgot Password?');
    expect(forgotButton.exists()).toBe(true);
  })

  it ('SignUp button rendered', () => {
    const wrapper = mount(<Router><Login/></Router>);
    const signupButton = wrapper.findWhere(n => n.type() === 'button' && n.text() === 'SIGN UP');
    expect(signupButton.exists()).toBe(true);
  })
  
  it ('Login snapshot', () => {
    const wrapper = shallow(<Login/>);

    expect(wrapper).toMatchSnapshot();
  })

  it ('Dialog box initially closed', () => {
    const wrapper = mount(<Router><Login/></Router>);
    const dialog = wrapper.find(Dialog);
    expect(dialog.props().open).toBe(false);
  })

  it ('Forgot password modal opens on click', () => {
    const wrapper = mount(<Router><Login/></Router>);
    const forgotButton = wrapper.findWhere(n => n.type() === 'button' && n.text() === 'Forgot Password?');
    forgotButton.simulate('click');
    const dialog = wrapper.find(Dialog);
    expect(dialog.props().open).toBe(true);
  })

  it ('Renders google Login button', () => {
    const wrapper = mount(<Router><Login/></Router>);

    expect(wrapper.find(GoogleLoginButton).exists()).toBe(true);
  })

  it ('Renders twitter Login button', () => {
    const wrapper = mount(<Router><Login/></Router>);

    expect(wrapper.find(TwitterLoginButton).exists()).toBe(true);
  })

  it ('Renders github Login button', () => {
    const wrapper = mount(<Router><Login/></Router>);

    expect(wrapper.find(GithubLoginButton).exists()).toBe(true);
  })
  it ('Renders facebook Login button', () => {
    const wrapper = mount(<Router><Login/></Router>);

    expect(wrapper.find(FacebookLoginButton).exists()).toBe(true);
  })
  
})
