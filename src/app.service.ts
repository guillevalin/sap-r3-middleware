import { Injectable } from '@nestjs/common';
import * as noderfc from "node-rfc";
import { RfcConnectionParameters } from 'node-rfc';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async test(): Promise<void> {
    try {
      // open connection
      const client = new noderfc.Client({ dest: "COTALKER_LAB" } as RfcConnectionParameters);
      await client.open();
      console.log(client.connectionInfo);
  
      // invoke ABAP function module, passing structure and table parameters
  
      // ABAP structure
      const abap_structure = {
        RFCINT4: 345,
        RFCFLOAT: 1.23456789,
        RFCCHAR4: "ABCD",
        RFCDATE: "20180625", // ABAP date format
        // or RFCDATE: new Date('2018-06-25'), // as JavaScript Date object, with clientOption "date"
      };
      // ABAP table
      let abap_table = [abap_structure];
  
      const result = await client.call("STFC_STRUCTURE", {
        IMPORTSTRUCT: abap_structure,
        RFCTABLE: abap_table,
      });
  
      // check the result
      console.log(result);
    } catch (err) {
      // connection and invocation errors
      console.error(err);
    }
  }
}
