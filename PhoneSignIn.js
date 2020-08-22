import React, { useState } from 'react';
import { Button, TextInput, View } from 'react-native';
//import auth from '@react-native-firebase/auth';
import {auth} from './firebaseConfig'

export default function PhoneSignIn() {
  // If null, no SMS has been sent
  const [confirm, setConfirm] = useState(null);

  const [code, setCode] = useState('');
  const [phone, setPhone] = useState('')

  // Handle the button press
  async function signInWithPhoneNumber(phoneNumber) {

    const appVerifier = new auth.RecaptchaVerifier('sign-in-button', {
        'size': 'invisible',
        'callback': function(response) {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          onSignInSubmit();
        }
    });
    const confirmation = await auth.signInWithPhoneNumber(phoneNumber, appVerifier);
    setConfirm(confirmation);
  }

  async function confirmCode() {
    try {
      await confirm.confirm(code);
    } catch (error) {
      console.log('Invalid code.');
    }
  }

  if (!confirm) {
    return (
      <View style={{flexDisplay: "row"}}>
        <TextInput style={{borderWidth: 1, marginBottom: 5, paddingLeft:10}} value={phone} 
            placeholder="+1 416-555-1234" placeholderTextColor="lightgray"
            keyboardType="phone-pad" onChangeText={text => setPhone(text)} />
        <Button
            title="Phone Sign In"
            onPress={() => signInWithPhoneNumber(phone)}
        />
      </View>
    );
  }

  return (
    <>
      <TextInput style={{borderWidth: 1, paddingLeft: 10}} value={code} onChangeText={text => setCode(text)} />
      <Button title="Confirm Code" onPress={() => confirmCode()} />
    </>
  );
}