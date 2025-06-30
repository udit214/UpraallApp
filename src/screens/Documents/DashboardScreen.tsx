import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DashboardScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Organization Profile</Text>
      {/* Add organization info here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212'
  },
  text: {
    color: '#fff', fontSize: 20, fontWeight: 'bold'
  }
});

export default DashboardScreen;
