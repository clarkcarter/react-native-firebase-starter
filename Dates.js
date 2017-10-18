import React from 'react'
import { FlatList, StyleSheet, Platform, Image, Text, View } from 'react-native'
import { CalendarList } from 'react-native-calendars'
import firebase from 'react-native-firebase'

export default class Dates extends React.Component {
  constructor() {
    super();
    this.ref = firebase.firestore().collection('dates');
    this.unsubscribe = null;
    this.state = {
      dates: [],
    };
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  componentWillUnmount() {
    this.unsubscribe();
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
    let markedDates = this.formatDates(this.state.dates)
    return (
      <View style={styles.container}>
        {/*<View>{this.state.dates.map((date) => <Text>{date.date}</Text>)}</View>*/}
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
