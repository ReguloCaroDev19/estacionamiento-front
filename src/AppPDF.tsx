import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Oswald',
    backgroundColor: '#ffffff',
    padding: 10,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  items: {
    marginLeft: 10,
  },
});

Font.register({
  family: 'Oswald',
  src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf',
});
export const AppPDF = (data: any) => {
  const cambioDeMinutosAHora = (totalMinutos: number) => {
    const minutos = totalMinutos % 60;
    const horas = Math.floor(totalMinutos / 60);

    return `${separar(horas)}:${separar(minutos)}`;
  };

  const separar = (num: number) => {
    return num.toString().padStart(2, '0');
  };
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {data.data
          ? data.data.map((a: any) => {
              return (
                <View key={a._id}>
                  <View style={styles.section}>
                    <View style={styles.item}>
                      <Text>Placa:</Text>
                      <Text style={styles.items}>{a.placa}</Text>
                    </View>
                    <View style={styles.item}>
                      <Text>Vehiculo:</Text>
                      <Text style={styles.items}>{a.residente}</Text>
                    </View>
                    <View style={styles.item}>
                      <Text>Entrada:</Text>
                      <Text style={styles.items}>
                        {a.entrada.map(
                          (entry: any) => ' ' + new Date(entry).toLocaleString()
                        )}
                      </Text>
                    </View>
                    <View style={styles.item}>
                      <Text>Salida:</Text>
                      <Text style={styles.items}>
                        {a.salida.map(
                          (salida: any) =>
                            ' ' + new Date(salida).toLocaleString()
                        )}
                      </Text>
                    </View>
                    <View style={styles.item}>
                      <Text>Tiempo en estacionamiento:</Text>
                      <Text style={styles.items}>
                        {a.cobro.map((minutos: any) => {
                          if (a.residente === 'No residente') {
                            if (minutos >= 60) {
                              return (
                                ' ' +
                                cambioDeMinutosAHora(minutos / 3) +
                                ' horas'
                              );
                            }
                            return ' ' + minutos + ' minutos';
                          } else if (minutos >= 60) {
                            return (
                              ' ' + cambioDeMinutosAHora(minutos) + ' horas'
                            );
                          }
                          return ' ' + minutos + ' minutos';
                        })}
                      </Text>
                    </View>
                    <View style={styles.item}>
                      <Text>Cobro:</Text>
                      <Text style={styles.items}>
                        {a.cobro.map(
                          (precio: any, i: number) =>
                            ' Salida ' + `${i + 1}` + ': $' + precio
                        )}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })
          : null}
      </Page>
    </Document>
  );
};
