import re

if __name__ == '__main__':
    archivo_nuevo = open(r'C:\Users\nelso\Documents\ISSS\f135_page_903_stantard_nuevo.sql', 'a')
    with open(r'C:\Users\nelso\Documents\ISSS\f135_page_903_stantard.sql') as archivo:
        ids = []
        for r in archivo:
            if 'p_id=>wwv_flow_imp.id' in r:
                m = re.search("[0-9]{1,}", r)
                if m:
                    id = m.group(0)
                    new_id = id[:-2] + '14'    
                    ids.append([id, new_id])    
            for v in ids:
                r = r.replace(v[0], v[1])
            archivo_nuevo.write(r)
    archivo.close()
