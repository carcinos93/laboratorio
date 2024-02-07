
if __name__ == '__main__':
    cadena = """:P17_OBSTETRICO_G,     
    :P17_OBSTETRICO_P,
    :P17_OBSTETRICO_P1,
    :P17_OBSTETRICO_A,
    :P17_OBSTETRICO_V,
    :P17_OBSTETRICO_VIA_PARTO,
    :P17_OBSTETRICO_TIPO_EMBARAZO,
    :P17_OBSTETRICO_CANT_EMBARAZO,
    :P17_OBSTETRICO_CESAREA_PROVINC,
    :P17_OBSTE_AMENORREA_SEMANAS,
    :P17_OBSTE_AMENORREA_DIAS"""
    
    nuevo = ",".join(list(map(lambda x: x.strip().replace(':', ''), cadena.split(",")) ))
    print(nuevo)