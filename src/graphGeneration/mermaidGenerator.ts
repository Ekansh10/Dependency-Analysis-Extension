

interface ClassData {
    packageName: string[];
    name: string;
    flags: {
        isAbstract: boolean;
        isStatic: boolean;
        isFinal: boolean;
        isInterface: boolean;
    };
    superclass: string | null;
    interfaces: string[];
}

interface Field {
    name: string;
    type: string;
    isArray: boolean;
    modifiers: string[];
    annotations: any[];
}

interface MethodParameter {
    name: string;
    type: string;
    isArray: boolean;
}

interface Method {
    name: string;
    returnType: string;
    modifiers: string[];
    flags: {
        isAbstract: boolean;
        isFinal: boolean;
        isStatic: boolean;
    };
    parameters: MethodParameter[];
    exceptions: string[];
    annotations: any[];
}

interface Constructor {
    modifiers: string[];
    parameters: MethodParameter[];
    exceptions: string[];
    annotations: any[];
}

interface Dependency {
    className: string;
    type: string;
}

interface FullClassData {
    name: string;
    modifiers: string[];
    fields: Field[];
    constructor: Constructor[];
    methods: Method[];
    dependencies: {
        incoming?: Dependency[];
        outgoing?: Dependency[];
    };
}

export default async function mermaidGenerator(classData: ClassData[]): Promise<string> {
    let mermaidCode = "graph TD\n";

    // Group classes by package name
    const packages: Record<string, ClassData[]> = {};

    classData.forEach((cls) => {
        const packageName = cls.packageName.join('.');
        if (!packages[packageName]) {
            packages[packageName] = [];
        }
        packages[packageName].push(cls);
    });

    // Generate nodes for packages and their classes
    Object.keys(packages).forEach((packageName) => {
        // Add the package node
        mermaidCode += `    ${packageName}["${packageName}"]\n`;

        // Add class nodes and connect them to the package node
        packages[packageName].forEach((cls) => {
            const classType = cls.flags.isInterface ? "Interface" : "Class";
            const modifiers = `${cls.flags.isAbstract ? 'A' : ''}${cls.flags.isStatic ? 'S' : ''}${cls.flags.isFinal ? 'F' : ''}${cls.flags.isInterface ? 'I' : 'C'}`;
            const className = cls.name;

            // Create a class node with its name and modifiers
            mermaidCode += `    ${className}["${modifiers} ${classType} ${className}"]\n`;

            // Connect class to package (arrow direction is reversed)
            mermaidCode += `    ${packageName} --> ${className}\n`;

            // If the class has a superclass, show the relationship
            if (cls.superclass) {
                mermaidCode += `    ${className} -.->|extends| ${cls.superclass}\n`;
            }

            // If the class implements interfaces, show the relationship
            cls.interfaces.forEach((intf) => {
                mermaidCode += `    ${className} -.->|implements| ${intf}\n`;
            });
        });
    });

    return mermaidCode;
}

// Function to format FullClassData
function formatFullClassData(fullClassData: FullClassData): string {
    let formattedData = "";

    // Add modifiers
    formattedData += fullClassData.modifiers.join(', ') + '\n';

    // Add fields
    fullClassData.fields.forEach(field => {
        const fieldType = field.isArray ? `${field.type}[]` : field.type;
        formattedData += `${fieldType}: ${field.name}\n`;
    });

    // Add constructors
    fullClassData.constructor.forEach(constructor => {
        const paramList = constructor.parameters.map(param => `${param.type}${param.isArray ? '[]' : ''}`).join(', ');
        formattedData += `constructor: ${fullClassData.name}(${paramList})\n`;
    });

    // Add methods
    fullClassData.methods.forEach(method => {
        const paramList = method.parameters.map(param => `${param.type}${param.isArray ? '[]' : ''}`).join(', ');
        formattedData += `${method.returnType}: ${method.name}(${paramList})\n`;
    });

    // Add incoming dependencies
    if (fullClassData.dependencies.incoming) {
        formattedData += 'Incoming dependencies:\n';
        fullClassData.dependencies.incoming.forEach(dep => {
            formattedData += `${dep.className} (${dep.type})\n`;
        });
    }

    // Add outgoing dependencies
    if (fullClassData.dependencies.outgoing) {
        formattedData += 'Outgoing dependencies:\n';
        fullClassData.dependencies.outgoing.forEach(dep => {
            formattedData += `${dep.className} (${dep.type})\n`;
        });
    }

    return formattedData;
}
