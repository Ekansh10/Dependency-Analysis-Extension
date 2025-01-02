
import { Element } from '../views/tree/tokens/root';

export default function generateClassDiagram(initialClass: Element, itemsList: Element[]): string {
    let diagram = '';
    const processedClasses = new Set<string>();
    const processedRelations = new Set<string>();
    const classQueue: Element[] = [initialClass];

    // Process all classes first
    while (classQueue.length > 0) {
        const classData = classQueue.shift()!;
        const className = cleanClassName(classData.name);

        // Skip if already processed
        if (processedClasses.has(className)) {
            continue;
        }
        processedClasses.add(className);

        // Generate class definition
        diagram += generateClassDefinition(classData);

        // Add dependencies to queue
        if (classData.outGoingDependencies) {
            for (const dep of classData.outGoingDependencies) {
                const item = itemsList.find((ele) => ele.name === dep);
                if (!dep.includes('$') && !dep.includes('lambda') && item && !processedClasses.has(cleanClassName(dep))) {
                    classQueue.push(item);
                }
            }
        }
    }

    // Process all relationships after classes are defined
    processedClasses.clear(); // Reset for relationship processing
    const relationshipQueue = [initialClass];

    while (relationshipQueue.length > 0) {
        const classData = relationshipQueue.shift()!;
        const className = cleanClassName(classData.name);

        if (processedClasses.has(className)) {
            continue;
        }
        processedClasses.add(className);

        // Add relationships
        diagram += generateRelationships(classData, itemsList, processedRelations);

        // Add dependencies to queue
        if (classData.outGoingDependencies) {
            for (const dep of classData.outGoingDependencies) {
                const item = itemsList.find((ele) => ele.name === dep);
                if (!dep.includes('$') && !dep.includes('lambda') && item && !processedClasses.has(cleanClassName(dep))) {
                    relationshipQueue.push(item);
                }
            }
        }
    }

    return diagram;
}

function generateClassDefinition(classData: Element): string {
    let definition = '';
    const className = cleanClassName(classData.name);
    

    definition += `    class ${className} {\n`;

    const stereotypes: string[] = [];
    if (classData.abstract) stereotypes.push('abstract');
    else if (classData.interface) stereotypes.push('interface');
    else if(classData.abstract && classData.interface)  stereotypes.push('abstract');

    if (stereotypes.length > 0) {
        definition += `       <<«${stereotypes}»>>\n`;
    }

    // Fields
    classData.fields.forEach(field => {
        const modifier = formatAccessModifier(field.modifier.toLowerCase());
        const fieldType = cleanTypeName(field.type);
        const staticModifier = field.static ? 'static ' : '';
        const finalModifier = field.final ? 'final ' : '';
        definition += `        ${modifier}${staticModifier}${finalModifier}${fieldType} ${field.name}\n`;
    });

    // Constructors
    const constructors = classData.methods.filter(method => method.name === '<init>' || method.name === '<clinit>');
    constructors.forEach(constructor => {
        const modifier = formatAccessModifier(constructor.accessModifier.toLowerCase());
        definition += `        ${modifier}${className}(${formatParameters(constructor.parameters)})\n`;
    });

    // Methods
    const regularMethods = classData.methods.filter(method => method.name !== '<init>' && method.name !== '<clinit>');
    regularMethods.forEach(method => {
        const modifier = formatAccessModifier(method.accessModifier.toLowerCase());
        const staticModifier = method.static ? 'static ' : '';
        const finalModifier = method.final ? 'final ' : '';
        const abstractModifier = method.abstract ? 'abstract ' : '';
        const returnType = cleanTypeName(method.returnType);
        definition += `        ${modifier}${staticModifier}${finalModifier}${abstractModifier}${returnType} ${method.name}(${formatParameters(method.parameters)})\n`;
    });

    definition += '    }\n';
    return definition;
}

function generateRelationships(classData: Element, itemsList: Element[], processedRelations: Set<string>): string {
    let relationships = '';
    const className = cleanClassName(classData.name);

    // Add inheritance/interface relationships
    if (classData.superClassName) {
        const superClasses = Array.isArray(classData.superClassName) 
            ? classData.superClassName 
            : [classData.superClassName];

        superClasses.forEach(superClass => {
            if (superClass && superClass !== 'java.lang.Object') {
                const superClassName = cleanClassName(superClass);
                const relation = `${superClassName} <|-- ${className}`;
                if (!processedRelations.has(relation)) {
                    relationships += `    ${relation}\n`;
                    processedRelations.add(relation);
                }
            }
        });
    }

    // Add interface implementations
    if (classData.interfaces && classData.interfaces.length > 0) {
        classData.interfaces.forEach(interfaceName => {
            const cleanInterfaceName = cleanClassName(interfaceName);
            const relation = `${cleanInterfaceName} <|.. ${className}`;
            if (!processedRelations.has(relation)) {
                relationships += `    ${relation}\n`;
                processedRelations.add(relation);
            }
        });
    }

    // Add dependencies
    if (classData.outGoingDependencies) {
        for (const dep of classData.outGoingDependencies) {
            const item = itemsList.find((ele) => ele.name === dep);
            if (!dep.includes('$') && !dep.includes('lambda') && item) {
                const relation = `${cleanClassName(dep)} *-- ${className}`;
                if (!processedRelations.has(relation)) {
                    relationships += `    ${relation}\n`;
                    processedRelations.add(relation);
                }
            }
        }
    }

    return relationships;
}

// Utility functions remain the same
function cleanClassName(fullName: string): string {
    if (!fullName) return '';
    const parts = fullName.split('.');
    const rawName = parts[parts.length - 1];
    if (rawName.includes('$') && (rawName.includes('lambda') || /\$\d+$/.test(rawName))) {
        return parts[parts.length - 2];
    }
    return rawName.replace(/\$.*$/, '');
}

function cleanTypeName(type: string): string {
    if (!type) return '';
    // Handle generic types properly
    if (type.includes('<')) {
        const baseType = type.split('<')[0].split('.').pop();
        const genericType = type.split('<')[1].split('>')[0].split('.').pop();
        return `${baseType}~${genericType}~`; // Mermaid syntax for generics
    }
    return type
        .split('.').pop()!
        .replace(/\$.*$/, '');
}

function formatParameters(params: string[]): string {
    return params
        .map(param => cleanTypeName(param))
        .join(', ');
}

function formatAccessModifier(modifier: string): string {
    switch (modifier) {
        case 'public': return '+';
        case 'private': return '-';
        case 'protected': return '#';
        default: return '~';
    }
}