"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = mermaidGenerator;
async function mermaidGenerator(classData) {
    let mermaidCode = "graph TD\n";
    // Group classes by package name
    const packages = {};
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
function formatFullClassData(fullClassData) {
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
//# sourceMappingURL=mermaidGenerator.js.map