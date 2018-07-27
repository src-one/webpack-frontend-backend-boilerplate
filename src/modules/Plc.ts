//var ads = require('node-ads')
import * as ads from 'node-ads';
import { Module, Server } from '../server';
import { TIMEOUT } from 'dns';

var options = {
    //The IP or hostname of the target machine
    host: "192.168.1.174",
    //The NetId of the target machine
    amsNetIdTarget: "10.0.0.105.1.1",
    //The NetId of the source machine.
    //You can choose anything in the form of x.x.x.x.x.x,
    //but on the target machine this must be added as a route.
    amsNetIdSource: "192.168.137.50.1.1",
    verbose: true,

    //OPTIONAL: (These are set by default)
    //The tcp destination port
    //port: 48898
    //The ams source port
    //amsPortSource: 32905
    //The ams target port
    //amsPortTarget: 801
}

export class Plc {
    public client: any;
    public symbols: Symbol[];

    constructor(serviceURL: string, amsNetId: string) {
        this.connect(serviceURL, amsNetId);

        this.client.on('notification', (handle) => {
            console.log('notification', handle);
        });

        process.on('exit', () => {
            console.log("exit");
        });

        process.on('SIGINT', () => {
            this.client.end(() => {
                process.exit();
            });
        });

        this.client.on('error', (error) => {
            console.log(error);
        });

        if (Server.module.hot) {
            Server.module.hot.dispose(() => {
                console.log('Disposing entry module...');

                //this.disconnect();
            });
        }
    }

    private connect(serviceURL: string, amsNetId: string): void {
        console.log('connecting...');

        this.client = ads.connect(options, () => {
            console.log('connected...');
            //this.connected();
        });

        //this.connected();
    }

    private connected() {
        console.log('connected...');

        const connection = this.client.getSymbols((error, symbols) => {
            if (error) {
                console.log(error);
            }

            this.symbols = symbols;
            //console.log(this.symbols);
            //console.log(this.symbols);

            this.setValue('MAIN.LAMPE', false);

            const brightness = 0;
            let _value = (32767 - ((100 - brightness) / 100 * 32767));
            this.setValue('.DIMMER', _value);


            //this.setValue('.PT_Temp_Sensor', 0);
            //this.setValue('.AI_Licht_Sensor', 0);

            //connection.end();
        });
    }

    private disconnect(): void {
        console.log('disconnecting...');

        this.client.end();
    }

    public setValue(symName: string, value: any): void {
        const symbol = this.symbols.find((symbol) => {
            return symbol.name === symName;
        });

        console.log('setValue', symName, symbol, value);

        let bytelength = ads.BOOL;

        switch (symbol.type) {
            case 'BOOL':
                bytelength = ads.BOOL;
                break;
            case 'INT16':
                bytelength = ads.INT;
                break;
        }

        let handle = {
            symname: symName,
            bytelength: bytelength,
            propname: 'value',
            value: value,
        };

        this.client.write(handle, function (err, handle) {
            if (err) console.log(err)
            //result is the myHandle object with the new properties filled in
            console.log(handle)
            //All handles will be released automaticly here
            this.end();
        });
    }

    public checkValues(): void {
        console.log('check values...');

        /*
        let myHandle = {
            symname: 'MAIN.LAMPE',
            bytelength: ads.BOOL,
            propname: 'value',
            value: false,
        };

        const brightness = 0;
        let _value = (32767 - ((100 - brightness) / 100 * 32767));

        let myHandle2 = {
            symname: '.dimmer',
            bytelength: ads.INT,
            propname: 'value',
            value: _value,
        };

        let myHandle3 = {
            symname: '.lampe_global',
            bytelength: ads.BOOL,
            propname: 'value',
            value: true,
        };

        let myHandle4 = {
            symname: 'main.test',
            bytelength: ads.BOOL,
            propname: 'value',
            value: false,
        };

        this.client.write(myHandle, function (err, handle) {
            if (err) console.log(err)
            //result is the myHandle object with the new properties filled in
            console.log(handle)
            //All handles will be released automaticly here
            this.end();
        });
*/
/*
        this.client.read({
            symname: '.PT_Temp_Sensor',
            bytelength: ads.INT,
        }, function (err, handle) {
            if (err) {
                console.log(err)
            } else {
                console.log(handle.value);
            }
            this.end();
        });

        this.client.read({
            symname: '.AI_Licht_Sensor',
            bytelength: ads.INT,
        }, function (err, handle) {
            if (err) {
                console.log(err)
            } else {
                console.log(handle.value);
            }
            this.end();
        });

        this.client.read({
            symname: '.dimmer',
            bytelength: ads.INT,
        }, function (err, handle) {
            if (err) {
                console.log(err)
            } else {
                console.log(handle.value);
            }
            this.end();
        });
*/
/*
        this.client.read({
            symname: '.PT_Temp_Sensor',
            bytelength: ads.INT,
        }, function (err, handle) {
            if (err) {
                console.log(err)
            } else {
                console.log(handle);
            }
            this.end();
        });

        this.client.read({
            symname: '.AI_Licht_Sensor',
            bytelength: ads.INT,
        }, function (err, handle) {
            if (err) {
                console.log(err)
            } else {
                console.log(handle);
            }
            this.end();
        });
*/
/*
        this.client.read({
            symname: 'MAIN.LAMPE',
            bytelength: ads.BOOL,
        }, function (err, handle) {
            if (err) {
                console.log(err)
            } else {
                console.log(handle);
            }
            this.end();
        });

        this.client.read({
            symname: '.DIMMER',
            bytelength: ads.UINT,
        }, function (err, handle) {
            if (err) {
                console.log(err)
            } else {
                console.log(handle);
            }
            this.end();
        });
*/
        this.client.readSymbolDesc({
            symname: '.PT_Temp_Sensor',
        }, function (err, handle) {
            if (err) {
                console.log(err)
            } else {
                console.log(handle);
            }
            this.end();
        });
/*
        this.client.multiRead(
            [{
                symname: 'MAIN.LAMPE',
                indexGroup: 16448,
                indexOffset: 10438,
                bytelength: ads.BOOL,
            }, {
                symname: '.DIMMER',
                indexGroup: 16448,
                indexOffset: 26938,
                bytelength: ads.UINT,
            }],
            function (err, handle) {
                if (err) console.log(err)
                    console.log('multiReadResult', handle)
            });
            */
        /*
                this.client.readDeviceInfo(function(err, result) {
                    if (err) console.log(err)
                    console.log(result)
                    this.end()
                });
        */
        /*
                this.client.getSymbols(function(err, symbols) {
                    if (err) console.log(err)
                    console.log(symbols)
                    this.end()
                });
        */
        /*
        this.client.write({
            symname: '.dimmer',
            bytelength: ads.INT,
            value: 100,
        }, function (err, handle) {
            if (err) {
                console.log(err)
            } else {
                console.log(handle.value);
            }
        });
*/
        /*
                var myHandle = {
                    symname: '.DI_Taster',
                    bytelength: ads.INT,
                    value: 50,
                    propname: 'value' 
                }
        
                var client = ads.connect(options, function() {
                    this.write(myHandle, function(err) {
                        if (err) 
                            console.log(err)
                        this.read(myHandle, function(err, handle) {
                            if (err) {
                                console.log(err)
                            } else {
                                console.log(handle.value)
                            }
        
                            this.end()
                        })
                    })
                })
        */
        /*
        this.notify({
            symname: '.AI_Licht_Sensor',
            bytelength: ads.INT,
        });
        this.notify({
            symname: '.PT_Temp_Sensor',
            bytelength: ads.INT,
        });
        */

        /*
        this.multiRead(
            [{
                symname: '.PT_Temp_Sensor',
                bytelength: ads.INT,
            }, {
                symname: '.DIM_aus_Strahler',
                bytelength: ads.INT,
            }],
            function (err, handle) {
                if (err) console.log(err)
                    console.log('multiReadResult', handle)
            });
        */
    }
}

/*
function () {
            this.^nection = this;
            /*
            this.notify({
                symname: '.AI_Licht_Sensor',
                bytelength: ads.INT,
                //OPTIONAL: (These are set by default)       
                //transmissionMode: ads.NOTIFY.ONCHANGE, (other option is ads.NOTIFY.CYLCIC)
                //maxDelay: 0,  -> Latest time (in ms) after which the event has finished
                //cycleTime: 10 -> Time (in ms) after which the PLC server checks whether the variable has changed
            });
            this.notify({
                symname: '.PT_Temp_Sensor',
                bytelength: ads.INT,
            });
            this.notify({
                symname: '.DI_Taster',
                bytelength: ads.BOOL,
            });
            this.read({
                symname: '.AI_Licht_Sensor',
                bytelength: ads.INT,
            }, function (err, handle) {
                if (err) console.log(err)
                console.log(handle.value)
            });
            this.read({
                symname: '.PT_Temp_Sensor',
                bytelength: ads.INT,
            }, function (err, handle) {
                if (err) console.log(err)
                console.log(handle.value)
            });
            this.read({
                symname: '.DI_Taster',
                bytelength: ads.BOOL,
            }, function (err, handle) {
                if (err) console.log(err)
                console.log(handle.value)
            });
        */
            /*
            {
                    symname: '.DO_Lampe_1',
                    bytelength: ads.BOOL,
                    name: '.DO_Lampe_1',
                    readLength: ads.BOOL,
                }, {
                    symname: 'MAIN.test',
                    bytelength: ads.BOOL,
                    name: 'MAIN.test',
                    readLength: ads.BOOL,
                }, {
                    symname: '.DI_Taster',
                    bytelength: ads.BOOL,
                    name: '.DI_Taster',
                    readLength: ads.BOOL,
                }, {
                    symname: '.AI_Licht_Sensor',
                    bytelength: ads.INT,
                    name: '.AI_Licht_Sensor',
                    readLength: ads.INT,
                }, {
                    symname: '.PT_Temp_Sensor',
                    bytelength: ads.INT,
                    name: '.PT_Temp_Sensor',
                    readLength: ads.INT,
                }, {
                    symname: '.DIM_aus_Strahler',
                    bytelength: ads.INT,
                    name: '.DIM_aus_Strahler',
                    readLength: ads.INT,
                }, {
                    symname: '.dimmer',
                    bytelength: ads.INT,
                    name: '.dimmer',
                    readLength: ads.INT,
                }
        */
/*
            this.read({
                symname: '.PT_Temp_Sensor',
                bytelength: ads.INT,
            }, function (err, handle) {
                if (err) console.log(err)
                console.log(handle.value)
            });
            this.read({
                symname: '.AI_Licht_Sensor',
                bytelength: ads.INT,
            }, function (err, handle) {
                if (err) console.log(err)
                console.log(handle.value)
            });
            */
        /*
            this.notify({
                symname: '.AI_Licht_Sensor',
                bytelength: ads.INT,
            });
            this.notify({
                symname: '.PT_Temp_Sensor',
                bytelength: ads.INT,
            });
        */
        /*
            this.multiRead(
                [{
                    symname: '.PT_Temp_Sensor',
                    bytelength: ads.INT,
                }, {
                    symname: '.DIM_aus_Strahler',
                    bytelength: ads.INT,
                }],
                function (err, handle) {
                    if (err) console.log(err)
                        console.log('multiReadResult', handle)
                });
        */

            /*
            this.readDeviceInfo(function(err, result) {
                if (err) console.log(err)
                console.log(result)
                this.end()
            });
            */
        /*
            this.getSymbols(function(err, symbols) {
                if (err) console.log(err)
                console.log(symbols)
                //this.end()
            });
        }
        */