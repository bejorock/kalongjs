/// <reference types="node" />
import localVarRequest = require('request');
import http = require('http');
export declare class InlineResponse200 {
    'exists'?: boolean;
    static discriminator: string | undefined;
    static attributeTypeMap: Array<{
        name: string;
        baseName: string;
        type: string;
    }>;
    static getAttributeTypeMap(): {
        name: string;
        baseName: string;
        type: string;
    }[];
}
export declare class InlineResponse2001 {
    'count'?: number;
    static discriminator: string | undefined;
    static attributeTypeMap: Array<{
        name: string;
        baseName: string;
        type: string;
    }>;
    static getAttributeTypeMap(): {
        name: string;
        baseName: string;
        type: string;
    }[];
}
export declare class InlineResponse2002 {
    'count'?: number;
    static discriminator: string | undefined;
    static attributeTypeMap: Array<{
        name: string;
        baseName: string;
        type: string;
    }>;
    static getAttributeTypeMap(): {
        name: string;
        baseName: string;
        type: string;
    }[];
}
export declare class UserController {
    'realm'?: string;
    'username'?: string;
    'email': string;
    'emailVerified'?: boolean;
    'id'?: string;
    static discriminator: string | undefined;
    static attributeTypeMap: Array<{
        name: string;
        baseName: string;
        type: string;
    }>;
    static getAttributeTypeMap(): {
        name: string;
        baseName: string;
        type: string;
    }[];
}
export declare class XAny {
    static discriminator: string | undefined;
    static attributeTypeMap: Array<{
        name: string;
        baseName: string;
        type: string;
    }>;
    static getAttributeTypeMap(): {
        name: string;
        baseName: string;
        type: string;
    }[];
}
export interface Authentication {
    applyToRequest(requestOptions: localVarRequest.Options): void;
}
export declare class HttpBasicAuth implements Authentication {
    username: string;
    password: string;
    applyToRequest(requestOptions: localVarRequest.Options): void;
}
export declare class ApiKeyAuth implements Authentication {
    private location;
    private paramName;
    apiKey: string;
    constructor(location: string, paramName: string);
    applyToRequest(requestOptions: localVarRequest.Options): void;
}
export declare class OAuth implements Authentication {
    accessToken: string;
    applyToRequest(requestOptions: localVarRequest.Options): void;
}
export declare class VoidAuth implements Authentication {
    username: string;
    password: string;
    applyToRequest(_: localVarRequest.Options): void;
}
export declare enum SampleControllerApiApiKeys {
}
export declare class SampleControllerApi {
    protected _basePath: string;
    protected defaultHeaders: any;
    protected _useQuerystring: boolean;
    protected authentications: {
        'default': Authentication;
    };
    constructor(basePath?: string);
    useQuerystring: boolean;
    basePath: string;
    setDefaultAuthentication(auth: Authentication): void;
    setApiKey(key: SampleControllerApiApiKeys, value: string): void;
    greet(settings?: any): Promise<{
        response: http.IncomingMessage;
        body: any;
    }>;
}
export declare enum UserControllerApiApiKeys {
}
export declare class UserControllerApi {
    protected _basePath: string;
    protected defaultHeaders: any;
    protected _useQuerystring: boolean;
    protected authentications: {
        'default': Authentication;
    };
    constructor(basePath?: string);
    useQuerystring: boolean;
    basePath: string;
    setDefaultAuthentication(auth: Authentication): void;
    setApiKey(key: UserControllerApiApiKeys, value: string): void;
    changePassword(oldPassword: string, newPassword: string, settings?: any): Promise<{
        response: http.IncomingMessage;
        body?: any;
    }>;
    confirm(uid: string, token: string, redirect?: string, settings?: any): Promise<{
        response: http.IncomingMessage;
        body?: any;
    }>;
    count(where?: string, settings?: any): Promise<{
        response: http.IncomingMessage;
        body: InlineResponse2002;
    }>;
    create(data?: UserController, settings?: any): Promise<{
        response: http.IncomingMessage;
        body: UserController;
    }>;
    createChangeStreamGetUserControllersChangeStream(options?: string, settings?: any): Promise<{
        response: http.IncomingMessage;
        body: Buffer;
    }>;
    createChangeStreamPostUserControllersChangeStream(options?: string, settings?: any): Promise<{
        response: http.IncomingMessage;
        body: Buffer;
    }>;
    deleteById(id: string, settings?: any): Promise<{
        response: http.IncomingMessage;
        body: any;
    }>;
    existsGetUserControllersidExists(id: string, settings?: any): Promise<{
        response: http.IncomingMessage;
        body: InlineResponse200;
    }>;
    existsHeadUserControllersid(id: string, settings?: any): Promise<{
        response: http.IncomingMessage;
        body: InlineResponse200;
    }>;
    find(filter?: string, settings?: any): Promise<{
        response: http.IncomingMessage;
        body: Array<UserController>;
    }>;
    findById(id: string, filter?: string, settings?: any): Promise<{
        response: http.IncomingMessage;
        body: UserController;
    }>;
    findOne(filter?: string, settings?: any): Promise<{
        response: http.IncomingMessage;
        body: UserController;
    }>;
    login(credentials: any, include?: string, settings?: any): Promise<{
        response: http.IncomingMessage;
        body: any;
    }>;
    logout(settings?: any): Promise<{
        response: http.IncomingMessage;
        body?: any;
    }>;
    patchOrCreate(data?: UserController, settings?: any): Promise<{
        response: http.IncomingMessage;
        body: UserController;
    }>;
    prototypePatchAttributes(id: string, data?: UserController, settings?: any): Promise<{
        response: http.IncomingMessage;
        body: UserController;
    }>;
    prototypeVerify(id: string, settings?: any): Promise<{
        response: http.IncomingMessage;
        body?: any;
    }>;
    replaceByIdPostUserControllersidReplace(id: string, data?: UserController, settings?: any): Promise<{
        response: http.IncomingMessage;
        body: UserController;
    }>;
    replaceByIdPutUserControllersid(id: string, data?: UserController, settings?: any): Promise<{
        response: http.IncomingMessage;
        body: UserController;
    }>;
    replaceOrCreatePostUserControllersReplaceOrCreate(data?: UserController, settings?: any): Promise<{
        response: http.IncomingMessage;
        body: UserController;
    }>;
    replaceOrCreatePutUserControllers(data?: UserController, settings?: any): Promise<{
        response: http.IncomingMessage;
        body: UserController;
    }>;
    resetPassword(options: any, settings?: any): Promise<{
        response: http.IncomingMessage;
        body?: any;
    }>;
    setPassword(newPassword: string, settings?: any): Promise<{
        response: http.IncomingMessage;
        body?: any;
    }>;
    updateAll(where?: string, data?: UserController, settings?: any): Promise<{
        response: http.IncomingMessage;
        body: InlineResponse2001;
    }>;
    upsertWithWhere(where?: string, data?: UserController, settings?: any): Promise<{
        response: http.IncomingMessage;
        body: UserController;
    }>;
}
