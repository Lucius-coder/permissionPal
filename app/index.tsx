import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Button, Linking} from 'react-native';
import {Camera} from "expo-camera"
import * as MediaLibrary from "expo-media-library";
import * as Location from "expo-location";
export default function Index() {
    const [cameraPermissionInformation, setCameraPermissionInformation] = useState<{
        status: string,
        canAskAgain: boolean
    } | null>(null);
    const [mediaLibraryPermissionInformation, setMediaLibraryPermissionInformation] = useState<{
        status: string,
        canAskAgain: boolean,
        granted: boolean
    }>(null);
    const [locationPermissionInformation, setLocationPermissionInformation] = useState<{
        status: string,
        canAskAgain: boolean,
        granted: boolean
    }>(null);

    const requestCameraPermission = async () => {
        console.log("requestingCamera permission")
        const permissionResponse = await Camera.requestCameraPermissionsAsync();
        console.log("Camera Permission Status:", permissionResponse)
        setCameraPermissionInformation(permissionResponse)
    }
    const requestMediaLibraryPermission = async () => {
        console.log("Requesting Media Library Permission...");

        const permissionResponse = await MediaLibrary.requestPermissionsAsync();
        console.log("Media Library Permission Response:", permissionResponse);
        setMediaLibraryPermissionInformation(permissionResponse);
    };
    const requestLocationPermission = async () => {
        console.log("Requesting Location Permission...");
        const permissionResponse = await Location.requestForegroundPermissionsAsync();
        console.log("Location Permission Response:", permissionResponse);
        setLocationPermissionInformation(permissionResponse);
    };
    useEffect(() => {
        const checkPermissions = async () => {
            console.log('Checking initial Camera Permission Status...');
            const permissionResponse = await Camera.getCameraPermissionsAsync();
            console.log('Initial Camera Permission Status:', permissionResponse);
            setCameraPermissionInformation(permissionResponse);

            console.log('useEffect: Checking initial Media Library Permission Status...');
            const mediaPermResponse = await MediaLibrary.getPermissionsAsync();
            console.log('useEffect: Initial Media Library Permission Response:', mediaPermResponse);
            setMediaLibraryPermissionInformation(mediaPermResponse);

            console.log('useEffect: Checking initial Location Permission Status...');
            const locationPermResponse = await Location.getForegroundPermissionsAsync();
            console.log('useEffect: Initial Location Permission Response:', locationPermResponse);
            setLocationPermissionInformation(locationPermResponse);
        };

        checkPermissions();
    }, []);
    console.log('------------------------------------');
    console.log('Rendering Camera Section - Current Info:', JSON.stringify(cameraPermissionInformation, null, 2));
    console.log('Status:', cameraPermissionInformation?.status);
    console.log('Can Ask Again:', cameraPermissionInformation?.canAskAgain);
    console.log('------------------------------------');
    return (
        <View style={styles.container}>
            <Text style={styles.title}>PermissionPal 🤖</Text>

            <View style={styles.section}>
                <Text>Camera Permission: {cameraPermissionInformation?.status || 'unknown'}</Text>

                {cameraPermissionInformation?.status === 'undetermined' ||
                (cameraPermissionInformation?.status === 'denied' && cameraPermissionInformation?.canAskAgain) ? (
                    <Button title="Request Camera Permission" onPress={requestCameraPermission}/>
                ) : cameraPermissionInformation?.status === 'denied' && !cameraPermissionInformation?.canAskAgain ? (
                    <Button title="Go to Settings" onPress={() => Linking.openSettings()}/>
                ) : null}
            </View>



            <View style={styles.section}>
                <Text>Media Library Permission: {mediaLibraryPermissionInformation?.status || 'unknown'}</Text>

                {mediaLibraryPermissionInformation?.status === 'undetermined' ||
                (mediaLibraryPermissionInformation?.status === 'denied' && mediaLibraryPermissionInformation?.canAskAgain) ? (
                    <Button title="Request Media Library Permission" onPress={requestMediaLibraryPermission}/>
                ) : mediaLibraryPermissionInformation?.status === 'denied' && !mediaLibraryPermissionInformation?.canAskAgain ? (
                    <Button title="Go to Settings (Media)" onPress={() => Linking.openSettings()}/>
                ) : mediaLibraryPermissionInformation?.status === 'limited' ? (
                    <Button title="Request Full Media Access" onPress={() => {
                    }}/>
                ) : null}
            </View>



            <View style={styles.section}>
                <Text>Foreground Location Permission: {locationPermissionInformation?.status || 'unknown'}</Text>

                {locationPermissionInformation?.status === 'undetermined' ||
                (locationPermissionInformation?.status === 'denied' && locationPermissionInformation?.canAskAgain) ? (
                    <Button title="Request Location Permission" onPress={ requestLocationPermission} />
                ) : locationPermissionInformation?.status === 'denied' && !locationPermissionInformation?.canAskAgain ? (
                    <Button title="Go to Settings (Location)" onPress={() => Linking.openSettings()} />
                ) : null }
            </View>



            <Text style={styles.footer}>Check console for more details!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    section: {
        marginBottom: 20,
        alignItems: 'center',
    },
    footer: {
        marginTop: 40,
        fontSize: 12,
        color: '#888',
    }
});