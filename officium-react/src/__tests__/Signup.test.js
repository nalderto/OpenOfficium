import React from 'react';
import { shallow } from '../enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { createMount, createShallow } from '@material-ui/core/test-utils'
import Signup from '../components/Signup'

import { GoogleLoginButton } from "react-social-login-buttons";
import { TwitterLoginButton } from "react-social-login-buttons";
import { GithubLoginButton } from "react-social-login-buttons";
import { FacebookLoginButton } from "react-social-login-buttons";

describe('Signup Page Tests', () => {
  let shallow;
  let mount;

  beforeAll(() => {
    mount = createMount();
    shallow = createShallow();
  });

  afterAll(() => {
    mount.cleanUp();
  })

  it ('Signup snapshot', () => {
    const wrapper = shallow(<Signup/>);

    expect(wrapper).toMatchSnapshot();
  })

  it ('Renders signUp button', () => {
    const wrapper = mount(<Router><Signup/></Router>);
    const button = wrapper.findWhere(n => n.type() === 'button' && n.text() === 'SIGN UP');
    expect(button.exists()).toBe(true);
  })


  it ('Renders google Signup button', () => {
    const wrapper = mount(<Router><Signup/></Router>);

    expect(wrapper.find(GoogleLoginButton).exists()).toBe(true);
  })

  it ('Renders twitter Signup button', () => {
    const wrapper = mount(<Router><Signup/></Router>);

    expect(wrapper.find(TwitterLoginButton).exists()).toBe(true);
  })

  it ('Renders github Signup button', () => {
    const wrapper = mount(<Router><Signup/></Router>);

    expect(wrapper.find(GithubLoginButton).exists()).toBe(true);
  })
  it ('Renders facebook Signup button', () => {
    const wrapper = mount(<Router><Signup/></Router>);

    expect(wrapper.find(FacebookLoginButton).exists()).toBe(true);
  })

})
