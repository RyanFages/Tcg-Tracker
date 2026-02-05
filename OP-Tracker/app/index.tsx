import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { db } from '../src/config/firebase'
import { collection, addDoc } from 'firebase/firestore';
import { useRouter}  from 'expo-router';

export default function Index() {
  const router = useRouter();

  const testConnection = async () => {
    try {
      const docRef = await addDoc(collection(db, "test_connection"), {
        timestamp: new Date(),
        message: "Hello One Piece from Expo Router!"
      });
      Alert.alert("Succès", `Document ID: ${docRef.id}`);
    } catch (e: any) {
      console.error("Erreur: ", e);
      Alert.alert("Erreur", e.message);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>OP-Tracker v1</Text>
      
      <View style={styles.separator} />
      
      <Button title="Test Firebase Connection" onPress={testConnection} />
      
      <View style={styles.separator} />

      {/* Exemple de navigation vers une autre page */}
      <Button 
        title="Aller au Scanner (Future page)" 
        onPress={() => router.push('/scanner')} // Cela cherchera le fichier app/scanner.tsx
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '80%',
    backgroundColor: '#eee',
  },
});