import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { CalendarList } from 'react-native-calendars'
import firebase from 'react-native-firebase'
import Login from './Login'
import Logout from './Logout'

export default class Dates extends React.Component {
  constructor() {
    super();
    this.ref = firebase.firestore().collection('dates');
    this.unsubscribe = null;
    this.state = {
      dates: [],
      user: null,
    };
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    this.unsubscriber = firebase.auth().onAuthStateChanged((user) => {
     this.setState({ user });
   });
  }

  componentWillUnmount() {
    this.unsubscribe();
    if (this.unsubscriber) {
      this.unsubscriber();
    }
  }

  onCollectionUpdate = (querySnapshot) => {
    let dates = [];
    querySnapshot.forEach((doc) => {
      const {date} = doc.data();
      dates.push({
        key: doc.id,
        doc,
        date,
      });

      this.setState({
        dates,
      });
    })
  }

  addDate = (day) => {
    let alreadySelected = this.state.dates.find((item) => item.date === day.dateString);
    let currentDate = day.dateString;
    if (alreadySelected) {
      this.ref.doc(alreadySelected.doc.id).delete();
    } else {
      this.ref.add({
        date: currentDate,
      });
    }
  }

  formatDates = (dates) => {
    let formattedDates = {};
    dates.forEach(date => {
      formattedDates[date.date] = {selected: true};
    })

    return formattedDates;
  }

  render() {
    let markedDates = this.formatDates(this.state.dates);
    if (!this.state.user) {
      return <Login />;
    }
    return (
      <View style={styles.container}>
        <Logout />
        <CalendarList
          onDayPress={this.addDate}
          markedDates={markedDates}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 25
  },
});
