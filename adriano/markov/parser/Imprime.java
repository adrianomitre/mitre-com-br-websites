import java.io.*;
//import java.util.*;

/**
 * <p>Description: Classe responsavel apenas pela leitura do arquivo</p>
 */
class Imprime {
	
	public static void main(String args[]){
		char alfabeto[]={'*','A','B','C','D','E','F','G','H','I','J','K','M','N','O','P','Q','R','S','T','U','V','X','Z','`'};
		
		try
		{
			//saida
			File file = new File("saida.txt");
			OutputStream output = new FileOutputStream(file);
			PrintStream print = new PrintStream(output);
			
			//entrada
			FileInputStream fileInput = 
				new FileInputStream("entrada.txt");
			
			int c = 0;
			while(c != '!')//eof
			{
				c = fileInput.read();
				String passado="";
				while((char)c!='('){
					char t=(char)c;
					passado=passado+t;
					c = fileInput.read();
				}
				
				int valores[]=new int[27];
				String aux=null;
				boolean achou=false;
				for(int k=0;k<26 &&!achou;k++){
					aux="";
					c = fileInput.read();
					while((char)c!=',' && (char)c!=')'){
						aux=aux+(char)c;
						c = fileInput.read();
					}
					valores[k]=Integer.parseInt(aux);
					if((char)c==')'){
						c = fileInput.read();
						while( (char)c != '\n' &&  (char)c != '!'){
							c = fileInput.read();
						}
						achou=true;
					}
				}
				//gera arquivo com probabilidades
				String s="";
				for(int k=0;k<25;k++){
					s=passado+','+alfabeto[k]+'='+valores[k]+'/'+valores[25];
					print.println(s);
				}	
			}
			fileInput.close();
			output.close();
		}
		catch(IOException e)
		{
			System.out.print("Nao foi possivel carregar o arquivo");
		}
	}
}