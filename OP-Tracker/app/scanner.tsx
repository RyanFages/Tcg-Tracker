import { CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Button,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import TextRecognition from "@react-native-ml-kit/text-recognition";

// Regex pour One Piece TCG (ex: OP05-060, ST01-004, P-035)
// Explication : 1 ou 2 lettres + tiret optionnel + 2 chiffres + tiret + 3 chiffres/lettres
const OP_CODE_REGEX = /([A-Z]{1,2}-?[0-9]{2}-[0-9]{3})/i;

export default function ScannerScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const cameraRef = useRef<CameraView>(null);

// Fonction de scan (définie ici, utilisée dans le useEffect)
  const scanImage = async () => {
    // Si la caméra n'est pas prête ou qu'on n'a pas la permission, on ne fait rien
    if (isProcessing || !cameraRef.current || !permission?.granted) return;

    try {
      setIsProcessing(true);
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.5, base64: false });
      
      if (photo?.uri) {
        const result = await TextRecognition.recognize(photo.uri);
        const foundBlock = result.blocks.find(block => OP_CODE_REGEX.test(block.text));
        
        if (foundBlock) {
          const match = foundBlock.text.match(OP_CODE_REGEX);
          if (match) {
            handleCardFound(match[0].toUpperCase());
            return; 
          }
        }
      }
    } catch (e) {
      console.error("Erreur OCR:", e);
    } finally {
      setTimeout(() => setIsProcessing(false), 500);
    }
  };

  const handleCardFound = (code: string) => {
    Alert.alert(
      "Carte Détectée !",
      `Code : ${code}`,
      [{ text: "OK", onPress: () => setIsProcessing(false) }]
    );
  };

  // Le useEffect doit être déclaré AVANT les return conditionnels
  useEffect(() => {
    const interval = setInterval(() => {
        if (!isProcessing) scanImage();
    }, 800);
    return () => clearInterval(interval);
  }, [isProcessing, permission]); // Ajout de permission dans les dépendances

  // --- 2. LES CONDITIONS D'AFFICHAGE (EARLY RETURNS) ---
  
  // Cas 1 : Chargement des permissions
  if (!permission) {
    return <View style={styles.container} />;
  }

  // Cas 2 : Permission refusée
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.textPermission}>Accès caméra requis pour scanner vos cartes.</Text>
        <Button onPress={requestPermission} title="Autoriser" />
      </View>
    );
  }

  // --- 3. RENDU FINAL (Si tout est OK) ---
  return (
    <View style={styles.container}>
      <CameraView 
        ref={cameraRef}
        style={styles.camera} 
        facing="back"
      >
        <View style={styles.overlay}>
          <View style={styles.topOverlay}>
            <Text style={styles.text}>Visez le code (ex: OP05-060)</Text>
            {isProcessing && <ActivityIndicator color="white" style={{marginTop: 10}}/>}
          </View>

          <View style={styles.middleOverlay}>
            <View style={styles.sideOverlay} />
            <View style={styles.scannerFrame}>
                <View style={[styles.corner, {top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3}]} />
                <View style={[styles.corner, {top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3}]} />
                <View style={[styles.corner, {bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3}]} />
                <View style={[styles.corner, {bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3}]} />
            </View>
            <View style={styles.sideOverlay} />
          </View>

          <View style={styles.bottomOverlay}>
            <TouchableOpacity style={styles.button} onPress={() => router.back()}>
              <Text style={styles.buttonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center" },
    textPermission: { textAlign: "center", marginBottom: 20, fontSize: 16 },
    camera: { flex: 1 },
    overlay: { flex: 1, backgroundColor: "transparent" },
    topOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    middleOverlay: { flexDirection: "row", height: 120 }, // Hauteur adaptée au code en bas de carte
    sideOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)" },
    scannerFrame: { width: 280, backgroundColor: "transparent" },
    bottomOverlay: {
        flex: 2,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
        letterSpacing: 1,
    },
    button: {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: "white",
    },
    buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
    corner: {
        position: "absolute",
        width: 20,
        height: 20,
        borderColor: "#00d2ff",
    }, // Couleur cyan futuriste
});
