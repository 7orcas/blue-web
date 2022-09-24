import { ConfigI } from '../definition/interfaces';

/*
 Class to store entity configurations
 
 Created 24.09.22
 [Licence]
 @author John Stewart
 */

export enum ConfigType {
  entity
} 

export enum ConfigReducer {
  entity
}

class Config {
  configs : ConfigI[] = []
}

export default Config