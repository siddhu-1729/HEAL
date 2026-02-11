import React from "react";
import { View, Text, Button } from "react-native";

export default function HomeScreen() {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22 }}>Welcome</Text>
      <Button title="Start Analysis" onPress={() => {}} />
    </View>
  );
}
