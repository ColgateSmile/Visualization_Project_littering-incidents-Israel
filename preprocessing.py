import pandas as pd



if __name__ == '__main__':

    df = pd.read_csv('DataSet.csv')
    df.drop(columns=[f'heged{i}' for i in range(1,14)], inplace=True)
    df = df.rename(columns={'זמןסיוםמהמערכת': 'sys_end_time',
                            'יישוב' : 'city',
                            'סמל_יישוב' : 'city_code',
                            'שעתהגעהלנקודה' : 'time_of_arrival',
                            'נ.צכתובת' : 'geo_location',
                            'כתובתתיאורמיקוםנקודתהמדידה' : 'location_address',
                            'סוגנקודתהמדידהתשובה' : 'location_type',
                            })
    df.to_csv('renamed_dataset.csv')
