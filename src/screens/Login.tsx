import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {useAuth} from '../context/AuthContext';

export default function Login({navigation}: any) {
  const {login} = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // ===============================
  // EMAIL + PASSWORD LOGIN
  // ===============================

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Please fill all fields');
      return;
    }

    try {
      setLoading(true);

      await login(
        email.trim(),
        password,
      );

       navigation.replace('Main');

      /*
       * AuthContext updates the user state.
       *
       * Later App.tsx will detect the logged-in user
       * and automatically show BottomTabNavigator.
       */
    } catch (error: any) {
      console.log('Login error:', error);

      Alert.alert(
        'Login Failed',
        error?.message || 'Invalid email or password',
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // GOOGLE LOGIN
  // ===============================

  const handleGoogleLogin = async () => {
    /*
     * Google authentication is not connected yet.
     *
     * Your old implementation used Appwrite.
     * We will implement Google OAuth with our own
     * Express backend later.
     */

    Alert.alert(
      'Coming Soon',
      'Google login will be connected later.',
    );
  };

  return (
    <ImageBackground
      source={require('../assets/loginback.jpg')}
      style={styles.background}
      resizeMode="cover">
      
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

          {/* ===============================
              LOGIN CARD
          =============================== */}

          <View style={styles.card}>
            <Text style={styles.title}>
              Welcome Back
            </Text>

            <Text style={styles.subtitle}>
              Login to continue
            </Text>

            {/* EMAIL */}

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* PASSWORD */}

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            {/* LOGIN BUTTON */}

            <TouchableOpacity
              style={[
                styles.button,
                loading && styles.disabledButton,
              ]}
              onPress={handleLogin}
              disabled={loading}>

              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  Login
                </Text>
              )}

            </TouchableOpacity>

            {/* SIGNUP LINK */}

            <TouchableOpacity
              onPress={() => navigation.navigate('Signup')}>

              <Text style={styles.link}>
                Don't have an account? Sign up
              </Text>

            </TouchableOpacity>
          </View>

          {/* ===============================
              GOOGLE LOGIN
          =============================== */}

          <View style={styles.card2}>

            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleLogin}>

              <Image
                source={require('../assets/google.png')}
                style={styles.icon}
              />

              <Text style={styles.buttonText}>
                Continue with Google
              </Text>

            </TouchableOpacity>

          </View>

        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.6)',
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: 'rgba(2, 6, 23, 0.92)',
    borderRadius: 12,
    padding: 24,

    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },

  card2: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 30,
    padding: 24,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 4,
  },

  input: {
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    color: '#fff',
    fontSize: 15,
  },

  button: {
    backgroundColor: '#2563EB',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    minHeight: 50,
  },

  disabledButton: {
    opacity: 0.7,
  },

  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#2563EB',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    minHeight: 50,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  link: {
    color: '#60A5FA',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },

  icon: {
    width: 26,
    height: 26,
    marginRight: 20,
  },
});