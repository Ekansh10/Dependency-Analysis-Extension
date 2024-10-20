"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMermaidFromJson = generateMermaidFromJson;
function generateMermaidFromJson(jsonData) {
    console.log("Inside generateMermaidFromJson with data:", jsonData);
    let mermaidCode = 'classDiagram\n';
    Object.keys(jsonData.packages).forEach(packageName => {
        const packageData = jsonData.packages[packageName];
        packageData.classes.forEach(classData => {
            const className = classData.qualifiedName.replace(/\./g, '_');
            // Define class
            mermaidCode += `class ${className}\n`;
            // Add fields
            classData.fields.forEach(field => {
                mermaidCode += `${className} : ${field.name}\n`;
            });
            // Add methods
            classData.methods.forEach(method => {
                const params = method.parameters.map(p => p.name).join(', ');
                mermaidCode += `${className} : ${method.name}(${params})\n`;
            });
            // Add relationships
            if (classData.superclass && classData.superclass !== 'java.lang.Object') {
                const superClass = classData.superclass.replace(/\./g, '_');
                mermaidCode += `${superClass} <|-- ${className}\n`;
            }
            classData.interfaces.forEach(iface => {
                const interfaceName = iface.replace(/\./g, '_');
                mermaidCode += `${interfaceName} <|.. ${className}\n`;
            });
            // Add dependencies
            if (classData.dependencies && classData.dependencies.outgoing) {
                classData.dependencies.outgoing.forEach(dep => {
                    const depClassName = dep.className.replace(/\./g, '_');
                    mermaidCode += `${className} --> ${depClassName} : ${dep.type}\n`;
                });
            }
        });
    });
    return mermaidCode;
}
//# sourceMappingURL=mermaidGenerator.js.map