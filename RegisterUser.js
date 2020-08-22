import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, FlatList, Platform, TextInput, View, Text, TouchableOpacity} from 'react-native';
import {auth} from './firebaseConfig';

export default function RegisterUser({navigation}) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");

    const addUser = () => {
        console.log("Add user button pressed!");

        if(name.trim() === "" || email.trim() === "" || password === "" || confPassword === "") {
            alert("None of the inputs should be left empty");
        } else {
            console.log("All input boxes have inputs");

            // check if passwords are a match
            if (password === confPassword) {
                auth.createUserWithEmailAndPassword(email.trim(), password)
                .then((userCredentials)=>{
                    if(userCredentials.user){
                      userCredentials.user.updateProfile({
                        displayName: name
                      })
                    }
                })
                .then(()=> {
                    alert('User account created and signed-in.j');
                    console.log(auth.currentUser)
                    navigation.navigate("MainScreen", {name: name, email: auth.currentUser.email})
                })
                .catch(error => {
                    if (error.code === 'auth/email-already-in-use') {
                        alert('That email address is already in use!');
                    }

                    if (error.code === 'auth/invalid-email') {
                        alert('That email address is invalid!');
                    }

                    console.error(error);
                });
            } else {
                alert("Passwords do not match!")
            }
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{marginHorizontal: 35, marginBottom: 30}}>
            <Text style={styles.registerLabels}>Name</Text>
            <TextInput style={styles.registerTextbox}
                onChangeText={(val) => setName(val.trim())}
            />
            <Text style={styles.registerLabels}>Email</Text>
            <TextInput style={styles.registerTextbox}
                keyboardType="email-address"
                onChangeText={(val) => setEmail(val.trim())}
            />
            <Text style={styles.registerLabels}>Password</Text>
            <TextInput style={styles.registerTextbox}
                secureTextEntry={true}
                onChangeText={(val) => setPassword(val)}/>
            <Text style={styles.registerLabels}>Confirm Password</Text>
            <TextInput style={styles.registerTextbox}
                secureTextEntry={true}
                onChangeText={(val) => setConfPassword(val)}/>    
            <TouchableOpacity
                onPress={addUser}>
                <Text style={styles.buttonStyle}>Create user and sign-in</Text>
            </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    //   alignItems: 'center',
    //   justifyContent: 'center',
    },
    registerLabels: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: "bold",
      }, 
    registerTextbox: {
        borderWidth: 1,
        borderRadius: 5, 
        paddingLeft: 10,
        marginTop: 10,
        fontSize: 25
    },
    buttonStyle: {
        backgroundColor: "lightgray", 
        paddingVertical: 8, 
        fontSize: 18, 
        borderWidth: 1, 
        borderRadius: 5, 
        width: Platform.OS==='web'?"40%":"80%", 
        textAlign: "center", 
        marginTop: 30,
        alignSelf:"center"
    }
});