import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  StatusBar,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONT, RADIUS } from '../theme/theme';

export default function SplashScreen({ onDone }) {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const tagOpacity = useRef(new Animated.Value(0)).current;
  const exitOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      // Logo pop in
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 60,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      // App name fades in
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 400,
        delay: 100,
        useNativeDriver: true,
      }),
      // Tagline fades in
      Animated.timing(tagOpacity, {
        toValue: 1,
        duration: 300,
        delay: 50,
        useNativeDriver: true,
      }),
      // Hold for 1s
      Animated.delay(1000),
      // Fade out everything
      Animated.timing(exitOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => onDone?.());
  }, []);

  return (
    <Animated.View style={[styles.root, { opacity: exitOpacity }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.primaryDark}
      />
      <LinearGradient
        colors={['#1A73E8', '#00C6AE']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bg}
      >
        {/* Decorative circles */}
        <View style={styles.circleTop} />
        <View style={styles.circleBtm} />

        {/* Logo */}
        <Animated.View
          style={[
            styles.logoWrap,
            { transform: [{ scale: logoScale }], opacity: logoOpacity },
          ]}
        >
          <View style={styles.logoBox}>
            <Image
              source={require('../../heal_verse_logo.jpeg')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        {/* App name */}
        <Animated.Text style={[styles.appName, { opacity: textOpacity }]}>
          HealVerse
        </Animated.Text>

        {/* Tagline */}
        <Animated.Text style={[styles.tagline, { opacity: tagOpacity }]}>
          Your AI Health Companion
        </Animated.Text>

        {/* Bottom indicator */}
        <Animated.View style={[styles.bottomDots, { opacity: tagOpacity }]}>
          <View style={styles.dotActive} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { ...StyleSheet.absoluteFillObject, zIndex: 999 },
  bg: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  circleTop: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  circleBtm: {
    position: 'absolute',
    bottom: -60,
    left: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  logoWrap: { marginBottom: 24 },
  logoBox: {
    width: 100,
    height: 100,
    borderRadius: 28,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: { width: '100%', height: '100%' },
  logoTxt: { fontSize: 42, fontWeight: '800', color: '#fff' },

  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 0.5,
    marginBottom: 60,
  },

  bottomDots: {
    position: 'absolute',
    bottom: 48,
    flexDirection: 'row',
    gap: 8,
  },
  dotActive: { width: 24, height: 8, borderRadius: 4, backgroundColor: '#fff' },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
});
