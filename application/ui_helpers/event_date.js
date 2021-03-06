import _              from 'underscore';
import {truncate}     from 'underscore.string';
import Icon           from 'react-native-vector-icons/Ionicons';
import moment         from 'moment';
import Colors         from '../styles/colors';
import Globals        from '../styles/globals';
import {BASE_URL, DEV, HEADERS} from '../utilities/fixtures';

import React, {
  ScrollView,
  Component,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
  NativeModules,
  InteractionManager,
  ActivityIndicatorIOS,
} from 'react-native';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

export default class EventDate extends React.Component{
  render(){
    let {start} = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.h2}>Date</Text>
        <Text style={styles.h4}>{moment(start).format('dddd, MMM Do, h:mm')}</Text>
      </View>
    )
  }
};

let styles = StyleSheet.create({
  h4: {
    fontSize: 16,
    fontWeight: '300',
    paddingHorizontal: 20,
  },
  h2: {
    fontSize: 20,
    fontWeight: '400',
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  container: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    paddingBottom: 10,
    marginBottom: 1,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 4,
  },
});
