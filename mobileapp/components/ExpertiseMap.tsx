import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ExpertiseData, PartStatus } from '../../admin/types'; // Assuming access to shared types or define here

// Local definitions if types can't be shared easily
type TPartStatus = 'original' | 'painted' | 'changed' | 'local_painted';
interface TExpertiseData {
    [key: string]: TPartStatus | undefined;
}

interface ExpertiseMapProps {
    data: TExpertiseData;
}

const PART_LABELS: { [key: string]: string } = {
    hood: 'Kaput',
    roof: 'Tavan',
    trunk: 'Bagaj',
    frontBumper: 'Ön Tampon',
    rearBumper: 'Arka Tampon',
    frontRightFender: 'Ön Sağ Çamurluk',
    frontLeftFender: 'Ön Sol Çamurluk',
    rearRightFender: 'Arka Sağ Çamurluk',
    rearLeftFender: 'Arka Sol Çamurluk',
    frontRightDoor: 'Ön Sağ Kapı',
    frontLeftDoor: 'Ön Sol Kapı',
    rearRightDoor: 'Arka Sağ Kapı',
    rearLeftDoor: 'Arka Sol Kapı',
};

const STATUS_COLORS: { [key in TPartStatus]: string } = {
    original: '#f8fafc', // slate-50
    painted: '#3b82f6', // blue-500
    local_painted: '#eab308', // yellow-500
    changed: '#ef4444', // red-500
};

const STATUS_TEXT: { [key in TPartStatus]: string } = {
    original: 'Orijinal',
    painted: 'Boyalı',
    local_painted: 'Lokal Boyalı',
    changed: 'Değişmiş',
};

export const ExpertiseMap: React.FC<ExpertiseMapProps> = ({ data }) => {
    const getPartStyle = (partName: string) => {
        const status = data[partName] || 'original';
        return {
            backgroundColor: STATUS_COLORS[status],
            borderColor: status === 'original' ? '#e2e8f0' : STATUS_COLORS[status],
        };
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ekspertiz Raporu</Text>

            <View style={styles.mapContainer}>
                {/* Visual Representation */}
                <View style={styles.carLayout}>
                    {/* Front Section */}
                    <View style={styles.row}>
                        <View style={[styles.part, styles.fender, getPartStyle('frontLeftFender')]} />
                        <View style={[styles.part, styles.hood, getPartStyle('hood')]} />
                        <View style={[styles.part, styles.fender, getPartStyle('frontRightFender')]} />
                    </View>

                    {/* Front Doors / Roof */}
                    <View style={styles.row}>
                        <View style={[styles.part, styles.door, getPartStyle('frontLeftDoor')]} />
                        <View style={[styles.part, styles.roof, getPartStyle('roof')]} />
                        <View style={[styles.part, styles.door, getPartStyle('frontRightDoor')]} />
                    </View>

                    {/* Rear Doors */}
                    <View style={styles.row}>
                        <View style={[styles.part, styles.door, getPartStyle('rearLeftDoor')]} />
                        <View style={[styles.part, styles.centerSpace]} />
                        <View style={[styles.part, styles.door, getPartStyle('rearRightDoor')]} />
                    </View>

                    {/* Rear Section */}
                    <View style={styles.row}>
                        <View style={[styles.part, styles.fender, getPartStyle('rearLeftFender')]} />
                        <View style={[styles.part, styles.trunk, getPartStyle('trunk')]} />
                        <View style={[styles.part, styles.fender, getPartStyle('rearRightFender')]} />
                    </View>
                </View>

                {/* Legend */}
                <View style={styles.legend}>
                    {Object.entries(STATUS_TEXT).map(([key, text]) => (
                        <View key={key} style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: STATUS_COLORS[key as TPartStatus] }]} />
                            <Text style={styles.legendText}>{text}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* List View for details */}
            <View style={styles.detailsList}>
                {Object.entries(data).map(([part, status]) => (
                    status && status !== 'original' && (
                        <View key={part} style={styles.detailItem}>
                            <Text style={styles.partLabel}>{PART_LABELS[part] || part}:</Text>
                            <Text style={[styles.statusLabel, { color: STATUS_COLORS[status] }]}>
                                {STATUS_TEXT[status]}
                            </Text>
                        </View>
                    )
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginVertical: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#1e293b',
    },
    mapContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    carLayout: {
        width: 180,
        padding: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 2,
    },
    part: {
        borderWidth: 1,
        borderRadius: 4,
        marginHorizontal: 2,
    },
    hood: {
        width: 60,
        height: 50,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    fender: {
        width: 30,
        height: 50,
    },
    door: {
        width: 30,
        height: 60,
    },
    roof: {
        width: 60,
        height: 60,
    },
    trunk: {
        width: 60,
        height: 40,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    centerSpace: {
        width: 60,
        height: 60,
        borderWidth: 0,
    },
    legend: {
        flex: 1,
        paddingLeft: 20,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    legendColor: {
        width: 16,
        height: 16,
        borderRadius: 4,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    legendText: {
        fontSize: 12,
        color: '#64748b',
    },
    detailsList: {
        marginTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        paddingTop: 12,
    },
    detailItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    partLabel: {
        fontSize: 14,
        color: '#475569',
    },
    statusLabel: {
        fontSize: 14,
        fontWeight: '600',
    },
});
