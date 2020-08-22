import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, FlatList, Platform, TextInput, View, Text, Button} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {auth} from './firebaseConfig'
//import PhoneSignIn from './PhoneSignIn'
// import GoogleSignIn from './GoogleSignIn'

export default function UserLogin({navigation}) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const signInPressed = () => {
        console.log("Sign-in button pressed")

        if (email.trim() === "" || password === "") {
            alert("Email and Password should not be empty.");
        } else {
            console.log("All input boxes have inputs");

            auth.signInWithEmailAndPassword(email.trim(), password)
            .then((userCredentials)=>{
                console.log(userCredentials.user)
                navigation.navigate("MainScreen", {name: userCredentials.user.displayName, email: userCredentials.user.email})
            })
            .catch(error => {
                if (error.code === 'auth/user-not-found') {
                    alert('User account with this email does not exist');
                }

                if (error.code === 'auth/invalid-email') {
                    alert('That email address is invalid!');
                }

                if (error.code === 'auth/wrong-password') {
                    alert('Wrong password was supplied.');
                }

                if (error.code === 'auth/user-disabled') {
                    alert('User account was disabled.');
                }

                console.error(error);
            });
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={{marginTop: 10, marginBottom: 10, fontSize: 25, textAlign: "center", fontWeight: "bold"}}>Welcome, please sign in</Text>
            <View style={{marginLeft: 35, marginRight: 35}}>
            <Text style={styles.loginLabels}>Email</Text>
            <TextInput style={styles.loginTextbox}
                keyboardType="email-address"
                onChangeText={(val)=>setEmail(val.trim())}
                value={email}
            />
            <Text style={styles.loginLabels}>Password</Text>
            <TextInput style={[styles.loginTextbox, {marginBottom: 10}]}
                secureTextEntry={true}
                onChangeText={(val)=>setPassword(val)}
                value={password}/>
            <TouchableOpacity
                onPress={signInPressed}>
                <Text style={styles.buttonStyle}>Sign-in</Text>
            </TouchableOpacity>

            <Text style={{marginTop: 10, fontStyle: "italic", fontSize: 15 }}>New user? Click button below to register</Text>

            <TouchableOpacity
                onPress={()=>navigation.navigate("RegisterUser")}>
                <Text style={[styles.buttonStyle, {marginBottom: 15}]}>Register</Text>
            </TouchableOpacity>

            {/* <Text style={{fontStyle: "italic", fontSize: 15, marginBottom:5 }}>Enter phone number to sign-in by phone</Text> */}
            {/* <PhoneSignIn /> */}
            {/* {Platform.OS!=='web' && <GoogleSignIn />} */}

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      
      //alignItems: 'center',
      //justifyContent: 'center',
    },
    loginLabels: {
      marginTop: 10,
      fontSize: 18,
      fontWeight: "bold",
    }, 
    loginTextbox: {
        borderWidth: 1,
        borderRadius: 5, 
        paddingLeft: 10,
        marginTop: 5,
        fontSize: 20
    },
    buttonStyle: {
        backgroundColor: "lightgray", 
        paddingVertical: 8, 
        fontSize: 18, 
        borderWidth: 1, 
        borderRadius: 5, 
        width: "40%", 
        textAlign: "center", 
        marginTop: 5
    }

});