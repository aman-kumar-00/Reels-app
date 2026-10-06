import React, {useState} from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {useAuth} from '../context/AuthContext';

const Profile = ({navigation}: any) => {
  const {user, logout} = useAuth();

  const [selectedTab, setSelectedTab] = useState('History');

  const tabs = [
    'History',
    'Following',
    'Like',
    'Reminder',
    'Settings',
  ];

  const handleSignIn = () => {
    navigation.getParent()?.navigate('Login');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.log('Logout error:', error);

              Alert.alert(
                'Logout Failed',
                'Unable to logout. Please try again.',
              );
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>

      {/* ================= PROFILE HEADER ================= */}

      <View style={styles.profileHeader}>

        <View style={styles.profileLeft}>
          <View style={styles.profileImageContainer}>
            <Image
              source={require('../assets/user.png')}
              style={styles.profileImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {user ? user.name : 'Guest'}
            </Text>

            <Text style={styles.userId}>
              ID: {user ? user.reelsAppId : '75084384767'}
            </Text>
          </View>
        </View>

        {/* RIGHT SIDE */}

        <View style={styles.headerRight}>

          {user ? (
            <TouchableOpacity
              onPress={handleLogout}
              activeOpacity={0.7}>
              <Text style={styles.logoutTop}>
                Logout
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleSignIn}
              activeOpacity={0.7}
              style={styles.signInButton}>
              <Text style={styles.signInText}>
                Sign in
              </Text>

              <Text style={styles.arrow}>
                ›
              </Text>
            </TouchableOpacity>
          )}

          {/* Settings icon */}

          <TouchableOpacity
            style={styles.settingsButton}
            activeOpacity={0.7}>
            <Text style={styles.settingsIcon}>
              ⚙
            </Text>
          </TouchableOpacity>

        </View>
      </View>


      {/* ================= ACCOUNT CARD ================= */}

      <View style={styles.accountCard}>

        <Text style={styles.accountTitle}>
          {user
            ? `Welcome back, ${user.name}`
            : 'Welcome to ReelsApp'}
        </Text>

        <Text style={styles.accountSubtitle}>
          {user
            ? 'Manage your ReelsApp account and preferences.'
            : 'Sign in to like, comment and save your favourite reels.'}
        </Text>

        {!user && (
          <TouchableOpacity
            style={styles.signInCardButton}
            onPress={handleSignIn}
            activeOpacity={0.8}>

            <Text style={styles.signInCardText}>
              Sign in
            </Text>

            <Text style={styles.cardArrow}>
              →
            </Text>

          </TouchableOpacity>
        )}

      </View>


      {/* ================= HORIZONTAL TABS ================= */}

      <View style={styles.tabsWrapper}>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}>

          {tabs.map(tab => {
            const isSelected = selectedTab === tab;

            return (
              <TouchableOpacity
                key={tab}
                style={styles.tab}
                onPress={() => setSelectedTab(tab)}
                activeOpacity={0.7}>

                <Text
                  style={[
                    styles.tabText,
                    isSelected && styles.selectedTabText,
                  ]}>
                  {tab}
                </Text>

                {isSelected && (
                  <View style={styles.tabUnderline} />
                )}

              </TouchableOpacity>
            );
          })}

        </ScrollView>

      </View>


      {/* ================= TAB CONTENT ================= */}

      <View style={styles.contentContainer}>

        {selectedTab === 'History' && (
          <>
            <View style={styles.filterRow}>

              <TouchableOpacity style={styles.filterButton}>
                <Text style={styles.filterText}>
                  Drama
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.filterButton}>
                <Text style={styles.filterText}>
                  Anime
                </Text>
              </TouchableOpacity>

            </View>

            <View style={styles.emptyContainer}>

              <Text style={styles.emptyIcon}>
                ☕
              </Text>

              <Text style={styles.emptyText}>
                Go to the homepage to
              </Text>

            </View>
          </>
        )}

        {selectedTab === 'Following' && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>
              ♡
            </Text>

            <Text style={styles.emptyText}>
              No following yet
            </Text>
          </View>
        )}

        {selectedTab === 'Like' && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>
              ♡
            </Text>

            <Text style={styles.emptyText}>
              No liked reels yet
            </Text>
          </View>
        )}

        {selectedTab === 'Reminder' && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>
              🔔
            </Text>

            <Text style={styles.emptyText}>
              No reminders yet
            </Text>
          </View>
        )}

        {selectedTab === 'Settings' && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>
              ⚙
            </Text>

            <Text style={styles.emptyText}>
              Settings
            </Text>
          </View>
        )}

      </View>

    </View>
  );
};

export default Profile;


/* ===================================================== */
/*                         STYLES                        */
/* ===================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
    paddingTop: 45,
  },

  /* ================= HEADER ================= */

  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 20,
    marginBottom: 20,
  },

  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  profileImageContainer: {
    width: 64,
    height: 64,

    borderRadius: 32,

    backgroundColor: '#292929',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 14,
  },

  profileImage: {
    width: 40,
    height: 40,
    tintColor: '#999',
  },

  userInfo: {
    justifyContent: 'center',
  },

  userName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },

  userId: {
    color: '#aaa',
    fontSize: 15,
    marginTop: 3,
  },

  /* ================= HEADER RIGHT ================= */

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoutTop: {
    color: '#ff453a',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 16,
  },

  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },

  signInText: {
    color: '#fff',
    fontSize: 18,
  },

  arrow: {
    color: '#aaa',
    fontSize: 28,
    marginLeft: 4,
  },

  settingsButton: {
    width: 36,
    height: 36,

    alignItems: 'center',
    justifyContent: 'center',
  },

  settingsIcon: {
    color: '#ddd',
    fontSize: 25,
  },


  /* ================= ACCOUNT CARD ================= */

  accountCard: {
    backgroundColor: '#1c1c1c',

    borderRadius: 20,

    padding: 20,

    marginHorizontal: 20,
    marginBottom: 18,
  },

  accountTitle: {
    color: '#fff',
    fontSize: 21,
    fontWeight: '700',

    marginBottom: 8,
  },

  accountSubtitle: {
    color: '#999',
    fontSize: 14,

    lineHeight: 20,

    marginBottom: 18,
  },

  signInCardButton: {
    height: 50,

    backgroundColor: '#ff3b30',

    borderRadius: 12,

    alignItems: 'center',
    justifyContent: 'center',

    flexDirection: 'row',
  },

  signInCardText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },

  cardArrow: {
    color: '#fff',
    fontSize: 21,
    marginLeft: 8,
  },


  /* ================= TABS ================= */

  tabsWrapper: {
    marginBottom: 5,
  },

  tabsContainer: {
    paddingHorizontal: 20,
  },

  tab: {
    marginRight: 32,

    minWidth: 65,

    paddingBottom: 10,

    alignItems: 'center',
  },

  tabText: {
    color: '#888',
    fontSize: 19,
    fontWeight: '400',
  },

  selectedTabText: {
    color: '#fff',
  },

  tabUnderline: {
    height: 3,
    backgroundColor: '#fff',

    width: 42,

    borderRadius: 3,

    marginTop: 7,
  },


  /* ================= CONTENT ================= */

  contentContainer: {
    flex: 1,

    backgroundColor: '#1c1c1c',

    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,

    paddingTop: 12,

    marginTop: 0,
  },

  /* ================= FILTERS ================= */

  filterRow: {
    flexDirection: 'row',

    paddingHorizontal: 20,

    marginTop: 5,
    marginBottom: 10,
  },

  filterButton: {
    backgroundColor: '#555',

    paddingHorizontal: 22,
    paddingVertical: 7,

    borderRadius: 9,

    marginRight: 12,
  },

  filterText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },


  /* ================= EMPTY STATE ================= */

  emptyContainer: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

    paddingBottom: 100,
  },

  emptyIcon: {
    fontSize: 70,
    marginBottom: 15,
    color: '#777',
  },

  emptyText: {
    color: '#aaa',
    fontSize: 22,
  },
});