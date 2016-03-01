/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  Image,
  ListView,
  StatusBar,
  View
} from 'react-native';

const REQUEST_URL = 'https://www.points.com/public/lps?clientId=48ebd71c-585d-42d1-b217-90811c60fb24';

class Neatio extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      loaded: false
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    fetch(REQUEST_URL)
      .then(response => response.json())
      .then(responseData => {
        const lps = responseData.lps.filter(lp => !!lp.content.cardArtPath);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(lps),
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
        <StatusBar
          backgroundColor='red'
        />
        <ListView
          dataSource={this.state.dataSource}
          renderSectionHeader={this.renderMoviesHeader}
          renderRow={this.renderLp}
          style={styles.lps}
        />
      </View>
    );
  }

  renderMoviesHeader() {
    return (
      <View style={styles['movies-header']}>
        <Text style={styles['movies-header__text']}>
          Loyalty Wallet
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

  renderLp(lp) {
    return (
      <View style={styles.lp}>
        <Image
          style={styles['lp__thumbnail']}
          source={{uri: `https://www.points.com${lp.content.cardArtPath}`}}
        />
        <View style={styles['lp__content']}>
          <Text style={styles['lp__title']}>{lp.title}</Text>
          <Text style={styles['lp__year']}>{lp.year}</Text>
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  'app-container': {
    flex: 1
  },

  lps: {
    paddingTop: 20
  },

  'movies-header': {
    backgroundColor: '#2EA5DD',
    paddingTop: 20,
    paddingBottom: 20
  },

  'movies-header__text': {
    color: 'white',
    textAlign: 'center'
  },

  lp: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },

  'lp__content': {
    flex: 1,
    paddingLeft: 20
  },

  'lp__thumbnail': {
    width: 400,
    height: 252
  },

  'lp__title': {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'left'
  },

  'lp__year': {
    textAlign: 'left'
  }

});

AppRegistry.registerComponent('Neatio', () => Neatio);
