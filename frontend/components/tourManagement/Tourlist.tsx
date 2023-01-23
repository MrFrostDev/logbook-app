import {Button, StyleSheet, View, Text, ToastAndroid, ScrollView, TouchableOpacity} from "react-native";
import Tour from "../../model/Tour";
import {tours as tourList, updateTourList} from "../../api/tourManagement";
import {useEffect, useState} from "react";

export default function Tourlist({
                                     currentTour,
                                     setCurrentTour
                                 }: { currentTour: Tour | undefined, setCurrentTour: (tour: Tour | undefined) => void }) {
    const [tours, setTours] = useState<Tour[]>(tourList);

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: "numeric",
        minute: "numeric"
    }

    useEffect(() => {
        const interval = setInterval(() => {
            updateTourList("Felix").then(r => {
                ToastAndroid.show("Tourlist updated", ToastAndroid.SHORT);
                setTours(tourList);
            }).catch(error => {
                ToastAndroid.show(error.message, ToastAndroid.SHORT);
            });
        }, 10000);
        return () => clearInterval(interval);
    },[]);

    function LoadTour(selectedTour: Tour) {//loads selected Tour after pressing the tourbutton
        setCurrentTour(selectedTour);
    }

    return (
        <View style={styles.tourlistContainer}>
            {currentTour && currentTour.waypoints && currentTour.waypoints.length >= 1 ? (
                <View>
                    <Button
                        title={"back"}
                        onPress={() => setCurrentTour(undefined)}
                    />

                    <Text> {"Tour ID: " + currentTour.tourId} </Text>
                    <Text> {"User ID: " + currentTour.userId} </Text>
                    <Text> {"Coordinates: " + currentTour.waypoints[0].latitude + ", " + currentTour.waypoints[0].longitude + " - " + currentTour.waypoints[currentTour.waypoints.length - 1].latitude + ", " + currentTour.waypoints[currentTour.waypoints.length - 1].longitude} </Text>
                    <Text> {"Time: " + new Date(currentTour.waypoints[0].timestamp).toLocaleDateString("de-DE", options) + " - " + new Date(currentTour.waypoints[currentTour.waypoints.length - 1].timestamp).toLocaleDateString("de-DE", options)} </Text>
                </View>
            ) : (
                
                <View style={styles.tourlistContainer}>
                    <Text style={styles.headline}>Tours: </Text>
                    <ScrollView style={styles.list}>
                        {
                            tours && tours.map((tour, index) => {
                                if(tour.waypoints && tour.waypoints.length >= 1){
                                    let date1 = new Date(tour.waypoints[0].timestamp).toLocaleDateString("de-DE", options)
                                    let date2 = new Date(tour.waypoints[tour.waypoints.length - 1].timestamp).toLocaleDateString("de-DE", options)
                                    return (
                                        <TouchableOpacity 
                                            key={index} 
                                            style={styles.buttonContainer} 
                                            onPress={() => { LoadTour(tour) }}>
                                            <Text style={styles.buttonText}>{date1 + " - " + date2}</Text>
                                        </TouchableOpacity>
                                    )
                                }
                            })
                        }
                    </ScrollView>
                </View>
            )}
        </View>
    )


}


const styles = StyleSheet.create({
    tourlistContainer: {
        flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 20
    },
    headline: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    list: {
        flex: 1,
        marginHorizontal: 20,
    },
    buttonContainer: {
        backgroundColor: "lightblue",
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    },
});
