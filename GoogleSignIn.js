// import {
//     GoogleSignin,
//     GoogleSigninButton,
//     statusCodes,
//   } from '@react-native-community/google-signin';


// GoogleSignin.configure({
//     webClientId: '110294082983-umh7tcpnt707tgmo3819v014p3c195dn.apps.googleusercontent.com',
// });

// import React from 'react';
// import { Button } from 'react-native';

// export default function GoogleSignIn() {
//   return (
//     <Button
//       title="Google Sign-In"
//       onPress={() => onGoogleButtonPress().then(() => console.log('Signed in with Google!'))}
//     />
//   );
// }

import React from 'react';
import { Text } from 'react-native';
import * as GoogleSignIn from 'expo-google-sign-in';

export default class AuthScreen extends React.Component {
  state = { user: null };

  componentDidMount() {
    this.initAsync();
  }

  initAsync = async () => {
    await GoogleSignIn.initAsync({
      // You may ommit the clientId when the firebase `googleServicesFile` is configured
      clientId: '110294082983-mbd1ck8m7v79d04d5ujqpvljlqt40ma4.apps.googleusercontent.com',
    });
    this._syncUserWithStateAsync();
  };

  _syncUserWithStateAsync = async () => {
    const user = await GoogleSignIn.signInSilentlyAsync();
    this.setState({ user });
  };

  signOutAsync = async () => {
    await GoogleSignIn.signOutAsync();
    this.setState({ user: null });
  };

  signInAsync = async () => {
    try {
      await GoogleSignIn.askForPlayServicesAsync();
      const { type, user } = await GoogleSignIn.signInAsync();
      if (type === 'success') {
        this._syncUserWithStateAsync();
      }
    } catch ({ message }) {
      alert('login: Error:' + message);
    }
  };

  onPress = () => {
    if (this.state.user) {
      this.signOutAsync();
    } else {
      this.signInAsync();
    }
  };

  render() {
    return <Text onPress={this.onPress}>Toggle Auth</Text>;
  }
}