import React, { useEffect } from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { StyleSheet, View, Dimensions } from 'react-native';
import Tour from "../../model/Tour";
import { getRegion } from "../../api/tourManagement";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Map({ selectedTour }: { selectedTour: Tour | undefined }) {
    const [mapStyle, setMapStyle] = React.useState("standard");

    useEffect(() => {
        AsyncStorage.getItem('mapStyle').then((value) => {
            setMapStyle(value || "standard");
        });
    }, []);

    return (
        <View style={styles.container}>
            {
                selectedTour && (
                    <MapView
                        style={styles.map}
                        provider="google"
                        loadingEnabled={true}
                        loadingIndicatorColor="#666666"
                        loadingBackgroundColor="#eeeeee"
                        showsCompass={false}
                        showsTraffic={false}
                        showsBuildings={false}
                        showsIndoors={false}
                        showsIndoorLevelPicker={false}
                        region={getRegion(selectedTour)}
                        moveOnMarkerPress={false}
                        zoomEnabled={true}
                        rotateEnabled={true}
                        scrollEnabled={true}
                        pitchEnabled={true}
                    >
                        <View>
                            {
                                selectedTour.waypoints.map((waypoint, index) => (
                                    <Marker
                                        key={index}
                                        coordinate={{
                                            latitude: waypoint.latitude,
                                            longitude: waypoint.longitude
                                        }}
                                        title={waypoint.timestamp.toString()}
                                    />
                                ))
                            }
                            <Polyline
                                coordinates={selectedTour.waypoints.map(waypoint => ({
                                    latitude: waypoint.latitude,
                                    longitude: waypoint.longitude
                                }))}
                                strokeColor="#0094c7" // fallback for when `strokeColors` is not supported by the map-provider
                                strokeWidth={6}
                            />
                        </View>
                    </MapView>
                )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height / 2.29,
    },
});
