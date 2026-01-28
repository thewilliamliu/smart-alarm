import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

// Mock calendar data - example events
const mockCalendarEvents = [
  {
    id: 1,
    title: 'Team Meeting',
    // Event at 9:30 AM on Jan 27, 2026
    startTime: new Date(2026, 0, 27, 9, 30, 0),
  },
  {
    id: 2,
    title: 'Dentist Appointment',
    // Event at 2:00 PM on Jan 27, 2026
    startTime: new Date(2026, 0, 27, 14, 0, 0),
  },
  {
    id: 3,
    title: 'Project Deadline',
    // Event at 5:00 PM on Jan 27, 2026
    startTime: new Date(2026, 0, 27, 17, 0, 0),
  },
];

export default function HomeScreen() {
  // State to store the buffer time (in minutes) - user can modify this
  const [bufferTime, setBufferTime] = useState(60);

  // State to store the calculated alarm time
  const [alarmTime, setAlarmTime] = useState<string | null>(null);

  // State to store the earliest event details
  const [earliestEvent, setEarliestEvent] = useState<any>(null);

  /**
   * Function to calculate the alarm time
   * This function:
   * 1. Finds the earliest event from the calendar
   * 2. Subtracts the buffer time from the event's start time
   * 3. Updates the state with the calculated alarm time
   */
  const handleCalculateAlarmTime = () => {
    // Find the earliest event - reduce through all events to find the one with the earliest startTime
    const earliest = mockCalendarEvents.reduce((min, event) => {
      return event.startTime < min.startTime ? event : min;
    });

    // Store the earliest event for display
    setEarliestEvent(earliest);

    // Create a new date object by copying the earliest event's start time
    const alarmDate = new Date(earliest.startTime);

    // Subtract the buffer time (in minutes) from the alarm date
    // getTime() returns milliseconds, so multiply minutes by 60000
    alarmDate.setTime(alarmDate.getTime() - bufferTime * 60000);

    // Format the alarm time as a readable string (HH:MM AM/PM)
    const formattedTime = alarmDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    // Update state with the calculated alarm time
    setAlarmTime(formattedTime);
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <Text style={styles.title}>⏰ Smart Alarm</Text>
        <Text style={styles.subtitle}>Calendar-based wake-up assistant</Text>
      </ThemedView>

      {/* Buffer Time Section */}
      <ThemedView style={styles.section}>
        <Text style={styles.sectionTitle}>Buffer Time (Minutes)</Text>
        <Text style={styles.bufferDisplay}>{bufferTime} min</Text>

        <View style={styles.bufferButtonContainer}>
          {/* Button to decrease buffer time */}
          <TouchableOpacity
            style={styles.bufferButton}
            onPress={() => setBufferTime(Math.max(0, bufferTime - 15))}
          >
            <Text style={styles.bufferButtonText}>−15 min</Text>
          </TouchableOpacity>

          {/* Button to increase buffer time */}
          <TouchableOpacity
            style={styles.bufferButton}
            onPress={() => setBufferTime(bufferTime + 15)}
          >
            <Text style={styles.bufferButtonText}>+15 min</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>

      {/* Calendar Events List */}
      <ThemedView style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        {mockCalendarEvents.map((event) => (
          <View key={event.id} style={styles.eventItem}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventTime}>
              {event.startTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </Text>
          </View>
        ))}
      </ThemedView>

      {/* Main Sync Button */}
      <ThemedView style={styles.section}>
        <TouchableOpacity
          style={styles.syncButton}
          onPress={handleCalculateAlarmTime}
        >
          <Text style={styles.syncButtonText}>📱 Simulate Calendar Sync</Text>
        </TouchableOpacity>
      </ThemedView>

      {/* Alarm Time Display */}
      {alarmTime && (
        <ThemedView style={styles.resultSection}>
          <Text style={styles.resultLabel}>Calculated Alarm Time:</Text>
          <Text style={styles.alarmTimeDisplay}>{alarmTime}</Text>
          {earliestEvent && (
            <View style={styles.detailsContainer}>
              <Text style={styles.detailsText}>
                Earliest Event: <Text style={styles.detailsBold}>{earliestEvent.title}</Text>
              </Text>
              <Text style={styles.detailsText}>
                Event Time:{' '}
                <Text style={styles.detailsBold}>
                  {earliestEvent.startTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </Text>
              </Text>
              <Text style={styles.detailsText}>
                Buffer: <Text style={styles.detailsBold}>{bufferTime} minutes</Text>
              </Text>
            </View>
          )}
        </ThemedView>
      )}

      {/* Info Section */}
      <ThemedView style={styles.section}>
        <Text style={styles.infoTitle}>How it works:</Text>
        <Text style={styles.infoText}>1. Adjust the buffer time above (or use defaults)</Text>
        <Text style={styles.infoText}>2. Tap "Simulate Calendar Sync" to calculate</Text>
        <Text style={styles.infoText}>3. The app finds your earliest event</Text>
        <Text style={styles.infoText}>4. It subtracts the buffer time to set your alarm</Text>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
    backgroundColor: '#4A90E2',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  bufferDisplay: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A90E2',
    textAlign: 'center',
    marginBottom: 15,
  },
  bufferButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  bufferButton: {
    flex: 1,
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  bufferButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  eventItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  eventTime: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  syncButton: {
    backgroundColor: '#50C878',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  syncButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultSection: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#50C878',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  alarmTimeDisplay: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#50C878',
    marginBottom: 15,
  },
  detailsContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  detailsText: {
    fontSize: 13,
    color: '#555',
    marginVertical: 4,
  },
  detailsBold: {
    fontWeight: '600',
    color: '#333',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    marginVertical: 5,
    lineHeight: 20,
  },
});
