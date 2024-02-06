// Online Java Compiler
// Use this editor to write, compile and run your Java code online

class HelloWorld {
    public static void main(String[] args) {
        int n = 5;
        String m = '0' + Integer.toString(n);
        String n1 = m.substring(m.length() -1 ,  m.length() - 2);
        System.out.println(n1);
    }
}