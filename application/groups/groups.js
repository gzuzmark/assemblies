import _                  from 'underscore';
import Icon               from 'react-native-vector-icons/Ionicons';
import NavigationBar      from '../third_party/react-native-navbar/index';
import GroupBox           from './group_box';
import SuggestedGroupBox  from './suggested_group_box';
import AddGroupBox        from './add_group_box';
import Colors             from '../styles/colors';
import {DEV, HEADERS, BASE_URL} from '../utilities/fixtures';
import {groupsFixture, suggestedGroups,} from '../fixtures/group_fixtures';
import {profileFixture}   from '../fixtures/users';

import React, {
  ScrollView,
  Component,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  NativeModules,
  InteractionManager,
  ActivityIndicatorIOS,
} from 'react-native';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

let splitSuggestions = []
suggestedGroups.forEach((group, idx) => {
  if (idx & 1) { _.last(splitSuggestions).push(group);}
  else { splitSuggestions.push([group]); }
})

export default class Groups extends Component{
  componentDidMount(){
    if (! this.props.fetchedGroups || ! this.props.fetchedSuggestedGroups){
      this._loadGroups();
    }
  }
  _loadGroups(){
    if (DEV) {console.log('URL', url)}
    let groupIds = this.props.currentUser.groupIds;
    let url = `${BASE_URL}/groups?{"id": {"$in": ${JSON.stringify(groupIds)}}}`;
    fetch(url, {
      method: "GET",
      headers: HEADERS,
    })
    .then((response) => response.json())
    .then((data) => {
      if (DEV) {console.log('DATA SG GROUPS', data)}
      let groups = data;
      let url = `${BASE_URL}/groups?{"id": {"$nin": ${JSON.stringify(groupIds)}}}`;
      fetch(url, {
        method: 'GET',
        headers: HEADERS,
      })
      .then((response) => response.json())
      .then((data) => {
        if (DEV) {console.log('SUGGESTED GROUPS', data, groups)}
        this.props.sendData({
          groups                  : groups,
          suggestedGroups         : data,
          fetchedGroups           : true,
          fetchedSuggestedGroups  : true,
        })
      })
    })
    .catch((error) => {
      if (DEV) {console.log(error)}
    }).done();
  }
  _renderAddButton(){
    return (
      <TouchableOpacity style={styles.forwardButton} onPress={()=>{
        this.props.navigator.push({
          name: 'CreateGroup'
        })
      }}>
        <Icon name="ios-plus-outline" size={25} color="#ccc" />
      </TouchableOpacity>
    )
  }
  _renderSuggestedGroupBoxes(groups){
    let splitGroups = [];
    groups.forEach((group, idx)=>{
      if (idx & 1) { _.last(splitGroups).push(group);}
      else { splitGroups.push([group]) }
    })
    if (_.last(splitGroups).length == 1){
      _.last(splitGroups).push(null)
    }
    if (DEV) {console.log('SPLIT GROUPS', splitGroups)}
    return (
      <View style={styles.assemblyBoxContainer}>
        {splitGroups.map((groupDouble, idx) => {
          return (
            <View style={styles.groupsContainer} key={idx}>
              {groupDouble.map((group, idx) => {
                if (!group) { return <GroupBox group={group} key={idx}/>;}
                return (
                  <TouchableOpacity key={idx} onPress={()=>{
                    this.props.navigator.push({
                      name: 'Group',
                      group: group,
                    })}}>
                    <SuggestedGroupBox {...this.props} group={group}/>
                  </TouchableOpacity>
                )
              })}
            </View>
          )
        })}
      </View>
    )
  }
  _renderGroupBoxes(groups){
    let splitGroups = [];
    groups.forEach((group, idx)=>{
      if (idx & 1) { _.last(splitGroups).push(group);}
      else { splitGroups.push([group]) }
    })
    if (_.last(splitGroups).length == 1){
      _.last(splitGroups).push(null)
    }
    if (DEV) {console.log('SPLIT GROUPS', splitGroups)}
    return (
      <View style={styles.assemblyBoxContainer}>
        {splitGroups.map((groupDouble, idx) => {
          return (
            <View style={styles.groupsContainer} key={idx}>
              {groupDouble.map((group, idx) => {
                if (!group) { return <AddGroupBox group={null} {...this.props} key={idx}/>;}
                return (
                  <TouchableOpacity key={idx} onPress={()=>{
                    this.props.navigator.push({
                      name: 'Group',
                      group: group,
                    })
                  }}>
                    <GroupBox group={group}/>
                  </TouchableOpacity>
                )
              })}
            </View>
          )
        })}
      </View>
    )
  }
  _renderNoGroups(){
    return (
      <View style={styles.assemblyBoxContainer}>
        <View style={styles.groupsContainer}>
          <AddGroupBox group={null} {...this.props}/>
          <GroupBox group={null}/>
        </View>
      </View>
    )
  }
  _renderNoSuggestions(){
    return (
      <View style={styles.assemblyBoxContainer}>
        <View style={styles.groupsContainer}>
          <GroupBox group={null}/>
          <GroupBox group={null}/>
        </View>
      </View>
    )
  }
  render(){
    let {groups, suggestedGroups,} = this.props;
    if (DEV) {console.log('GROUPS PROPS', this.props.groups.map((g) => g.name), this.props.suggestedGroups.map((g) => g.name));}
    let rightButtonConfig = this._renderAddButton()
    let titleConfig = {title: 'My Groups', tintColor: 'white'}
    return (
      <View style={styles.container}>
        <NavigationBar
          statusBar={{style: 'light-content', hidden: false}}
          title={titleConfig}
          tintColor={Colors.brandPrimary}
          rightButton={rightButtonConfig}
        />
        <ScrollView style={styles.assembliesContainer}>
          <Text style={styles.h2}>Your Assemblies</Text>
          {groups.length ? this._renderGroupBoxes(groups) : this._renderNoGroups()}
          <Text style={styles.h2}>You Might Like</Text>
          {suggestedGroups.length ? this._renderSuggestedGroupBoxes(suggestedGroups) : this._renderNoSuggestions()}
        </ScrollView>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  groupsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 5,
  },
  group: {
    opacity: 0.9,
    flex: 1,
    height: 150,
  },
  groupImage: {
    height: 150,
    width: (deviceWidth / 2) - 20,
    margin: 10,
    opacity: 0.8,
  },
  h2: {
    fontSize: 20,
    fontWeight: '400',
    paddingHorizontal: 10,
    color: Colors.bodyText,
  },
  h3: {
    fontSize: 18,
    fontWeight: '300',
    paddingHorizontal: 10,
  },
  groupText: {
    color: 'white',
    margin: 20,
    fontSize: 20,
    position: 'absolute',
    fontWeight: '500',
  },
  goingContainer: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goingText: {
    fontSize: 17,
    color: Colors.brandPrimary
  },
  eventContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  eventInfo: {
    flex: 1,
  },
  forwardButton: {
    paddingBottom: 8,
    paddingRight: 20,
    backgroundColor: 'transparent',
  }
});
