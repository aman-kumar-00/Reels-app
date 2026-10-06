import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {useAuth} from '../context/AuthContext';

export default function Signup({navigation}: any) {
  const {register} = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);

  // ===============================
  // SIGNUP
  // ===============================

  const handleSignup = async () => {
    if (
      !name.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert('Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Error', 'Passwords do not match');
      return;
    }

    try {
      setLoading(true);

      await register(
        name.trim(),
        email.trim(),
        password,
      );

      navigation.replace('Main');

      /*
       * AuthContext will handle the successful
       * registration/login state.
       */

    } catch (error: any) {
      console.log('Signup error:', error);

      Alert.alert(
        'Signup Failed',
        error?.message || 'Unable to create account',
      );
    } finally {
      setLoading(false);
    }
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
              SIGNUP CARD
          =============================== */}

          <View style={styles.card}>

            <Text style={styles.title}>
              Create Account 🚀
            </Text>

            <Text style={styles.subtitle}>
              Join us today
            </Text>

            {/* NAME */}

            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#888"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

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

            {/* CONFIRM PASSWORD */}

            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#888"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            {/* SIGNUP BUTTON */}

            <TouchableOpacity
              style={[
                styles.button,
                loading && styles.disabledButton,
              ]}
              onPress={handleSignup}
              disabled={loading}>

              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  Sign Up
                </Text>
              )}

            </TouchableOpacity>

            {/* LOGIN LINK */}

            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}>

              <Text style={styles.link}>
                Already have an account? Login
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
    backgroundColor: '#020617',
    borderRadius: 12,
    padding: 24,

    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
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
    backgroundColor: '#16A34A',
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
});