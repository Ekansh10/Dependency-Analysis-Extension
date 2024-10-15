import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.apache.commons.io.FileUtils;
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Opcodes;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;  
import java.util.HashMap;   
import java.util.HashSet;   
import java.util.List;      
import java.util.Map;       

public class DependencyExtractor {

    public static void main(String[] args) {
        String directoryPath = "/path/to/class/file/folder"; // Change this to your directory path
        Map<String, Object> dependenciesMap = new HashMap<>();

        try {
            List<File> classFiles = (List<File>) FileUtils.listFiles(new File(directoryPath), new String[]{"class"}, true);
            for (File classFile : classFiles) {
                String className = getClassName(classFile, directoryPath);
                List<String> dependencies = extractDependencies(classFile);
                
                // Only add the class to the map if it has dependencies
                if (!dependencies.isEmpty()) {
                    dependenciesMap.put(className, Map.of("dependencies", dependencies));
                }
            }

            // Write prettified JSON output to a file
            writeJsonToFile(dependenciesMap, "dependencies.json");

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static List<String> extractDependencies(File classFile) throws IOException {
        List<String> dependencies = new ArrayList<>();
        ClassReader classReader = new ClassReader(FileUtils.readFileToByteArray(classFile));

        // Create an inner class that extends ClassVisitor
        classReader.accept(new ClassVisitor(Opcodes.ASM9) {
            @Override
            public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
                if ("<init>".equals(name)) { // Check for constructor
                    List<String> formattedDependencies = formatDescriptor(descriptor);
                    dependencies.addAll(formattedDependencies);
                }
                return super.visitMethod(access, name, descriptor, signature, exceptions);
            }
        }, 0);

        // Remove duplicates
        return new ArrayList<>(new HashSet<>(dependencies)); 
    }

    private static List<String> formatDescriptor(String descriptor) {
        List<String> paramsList = new ArrayList<>();
        String[] paramTypes = descriptor.substring(1, descriptor.indexOf(')')).split(";");

        for (String paramType : paramTypes) {
            // Skip any parameter that starts with "Ljava/", is an array (starts with "["), is a primitive, or is a single letter
            if (paramType.startsWith("Ljava/") || paramType.startsWith("[") || 
                paramType.length() == 1 || 
                paramType.startsWith("Z") || paramType.startsWith("I") || 
                paramType.startsWith("C") || paramType.startsWith("J")) {
                continue; // Skip this parameter entirely
            }

            // Check for types that include "L" (object types)
            if (paramType.startsWith("L")) {
                // Remove the leading "L" and replace slashes with dots
                paramsList.add(paramType.substring(1).replace("/", "."));
            } else if (!paramType.isEmpty()) {
                paramsList.add(paramType); // Add primitive types as-is
            }
        }

        return paramsList;
    }

    private static String getClassName(File classFile, String directoryPath) {
        String relativePath = classFile.getAbsolutePath().substring(directoryPath.length() + 1);
        return relativePath.replace(File.separator, ".").replace(".class", "");
    }

    private static void writeJsonToFile(Map<String, Object> dependenciesMap, String fileName) throws IOException {
        // Create a Gson instance with pretty printing
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        String jsonOutput = gson.toJson(dependenciesMap);

        try (FileWriter fileWriter = new FileWriter(fileName)) {
            fileWriter.write(jsonOutput);
        }
        System.out.println("Output written to " + fileName);
    }
}
