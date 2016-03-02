/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  StatusBar,
  Text,
  Image,
  ListView,
  TouchableHighlight,
  Linking,
  Modal,
  View
} from 'react-native';

const REQUEST_URL = 'https://www.points.com/public/lps?clientId=48ebd71c-585d-42d1-b217-90811c60fb24';

class Neatio extends Component {

  constructor(props) {
    super(props);
    this.state = {
      lps: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      selectedLp: null,
      isShowingSelectedLp: false,
      loaded: false
    };

    this.renderLp = this.renderLp.bind(this);
    this._onPressLp = this._onPressLp.bind(this);
    this._onPressDone = this._onPressDone.bind(this);
    this._onPressLpLink = this._onPressLpLink.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    fetch(REQUEST_URL)
      .then(response => response.json())
      .then(responseData => {
        //remove lps with no cardArt
        const lps = responseData.lps.filter(lp => {
          const hasCardArt = !!lp.content.cardArtPath;
          const isEnabled = lp.content.isEnabled;
          return hasCardArt && isEnabled;
        });
        this.setState({
          lps: this.state.lps.cloneWithRows(lps),
          loaded: true
        });
      })
      .done();
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <View style={styles['app-container']}>
        <StatusBar barStyle="light-content" />
        <ListView
          dataSource={this.state.lps}
          renderSectionHeader={this.renderWalletHeader}
          renderRow={this.renderLp}
          style={styles.lps}
        />

        {this.state.isShowingSelectedLp ? this.renderLpDetail() : null}

      </View>
    );
  }

  renderLpDetail() {
    const { selectedLp } = this.state;
    return (
      <Modal animated={true}>
        <View style={styles['lp-detail']}>
          <View style={styles['lp-detail__logo-container']}>
            <Image style={styles['lp-detail__logo']}
                   resizeMode='contain'
                   source={{uri: `https://www.points.com${selectedLp.content.logos.png}`}}
            />
          </View>
          <Text style={styles.heading}>
            {selectedLp.name}
          </Text>

          <TouchableHighlight onPress={() => {this._onPressLpLink(selectedLp.content.websiteUrl)}}>
            <Text style={styles.link}>
              {selectedLp.content.websiteUrl}
            </Text>
          </TouchableHighlight>

          <Text style={styles.paragraph}>
            {selectedLp.content.description}
          </Text>
          <Text style={styles.paragraph}>
            {selectedLp.expiryPolicy}
          </Text>
          <TouchableHighlight onPress={this._onPressDone}>
            <View style={[styles.btn, styles['btn-primary']]}>
              <Text style={[styles['btn__text'], styles['text-white']]}>
                Done
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      </Modal>
    )
  }

  _onPressLpLink(url) {
    Linking.openURL(url);
  }

  _onPressDone() {
    this.setState({ isShowingSelectedLp: false });
  }

  renderWalletHeader() {
    return (
      <View style={styles['wallet-header']}>
        <Text style={styles['wallet-header__text']}>
          Loyalty Finder
        </Text>
      </View>
    );
  }

  renderLoadingView() {
    return (
      <View style={styles.container}>
        <Text>
          Loading Programs...
        </Text>
      </View>
    );
  }

  renderLp(lp, sectionID, rowID) {

    return (
      <View style={styles.lp}>
        <TouchableHighlight onPress={() => this._onPressLp(rowID)}>
          <Image
            style={styles['lp__thumbnail']}
            source={{uri: `https://www.points.com${lp.content.cardArtPath}`}}
          />
        </TouchableHighlight>
      </View>
    );
  }

  _onPressLp(rowID) {
    const selectedLp = this.state.lps.getRowData(0, rowID);
    this.setState({ selectedLp, isShowingSelectedLp: true });
  }

}

var styles = StyleSheet.create({
  'app-container': {
    flex: 1
  },

  'lp-detail': {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 40,
    paddingRight: 20,
    paddingBottom: 40,
    paddingLeft: 20
  },

  'lp-detail__logo-container': {
    alignItems: 'center'
  },

  'lp-detail__logo': {
    width: 100,
    height: 100
  },

  'wallet-header': {
    backgroundColor: '#FF6138',
    paddingTop: 20,
    paddingBottom: 20
  },

  'wallet-header__text': {
    color: 'white',
    textAlign: 'center'
  },

  lp: {
    flex: 1,
    alignItems: 'stretch',
    paddingBottom: 10,
    paddingTop: 10
  },

  'lp__thumbnail': {
    height: 200
  },

  'lp__content': {
    flex: 1,
    paddingLeft: 20
  },

  heading: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 20
  },

  paragraph: {
    fontWeight: '100',
    marginTop: 10,
    marginBottom: 10
  },

  link: {
    color: '#00A388'
  },

  btn: {
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 10
  },

  'btn__text': {
    textAlign: 'center',
    fontSize: 18,
    padding: 15
  },

  'btn-primary': {
    backgroundColor: '#79BD8F',
    borderColor: '#79BD8F'
  },

  'text-white': {
    color: 'white'
  }


});

AppRegistry.registerComponent('Neatio', () => Neatio);
