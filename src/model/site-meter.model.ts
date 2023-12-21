export interface SiteMeterPush {
    // obtain your API key from the app: My Equipment -> Solar / Battery Equipment, Push API 
    apiKey?: string
  
    // timestamp of meter data (milliseconds since epoch)
    // if the meter data is delayed and has a reliable timestamp then this field should
    // be provided if, otherwise it should be left unset
    tsms?: number
  
    // set this field only if there was an error obtaining the meter data
    error?: string
  
    // provide the meter data, unless there was an error
    siteMeters?: {
      // if solar is present, provide the following field
      production_kw?: number
  
      // if a consumption meter is present, the following fields should be set
      net_import_kw?: number //grid import, negative means export
      consumption_kw?: number //total site consumption
  
      // if accumulated import/export energy is available, set the following fields
      imported_kwh?: number
      exported_kwh?: number
  
      // if a battery is present, provide the following fields
      battery_discharge_kw?: number //negative mean charging
      battery_soc?: number //eg 0.5 = 50%
      battery_energy_kwh?: number //amount of energy in the battery (optional)
    }
  }