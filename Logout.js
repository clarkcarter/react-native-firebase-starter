import React from 'react'
import { Button } from 'react-native'
import firebase from 'react-native-firebase'

class Logout extends React.Component {

  logout = () => {
    firebase.auth().signOut();
  }

  render() {
    return (
      <Button onPress={this.logout} title="Logout"/>
    )
  }
}

export default Logout;
