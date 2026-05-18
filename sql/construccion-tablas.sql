USE [BD_SICASYS]
GO
/****** Object:  StoredProcedure [db_biblioteca].[sp_Construccion_Tablas]    Script Date: 5/10/2026 1:34:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


ALTER procedure [db_biblioteca].[sp_Construccion_Tablas]
    @IdFormulario int

as
begin

/*
 construccioon de tablas mssql
 **/
declare @tabla nvarchar(50);
-- Creacion de tabla temporal para almacenar los nombres de las tablas
if object_id('tempdb..#tablas') is not null drop table #tablas;
if object_id('tempdb..#columnas') is not null drop table #columnas;
create table #tablas (
tabla nvarchar(50),
IdFormulario int
);

create table #columnas (
IdFormularioCampo int,
nombre nvarchar(50),
tipo nvarchar(50),
requerido bit,
descripcion nvarchar(4000)
);

-- Insercion de los nombres de las tablas
insert into #tablas (tabla, IdFormulario)
select concat('DatosMaterial_', right(concat('000000000000', IdFormulario), 12)), IdFormulario
from db_biblioteca.Formulario where IdFormulario = @IdFormulario and audRegistroEliminado = 0;


while (select count(*) from #tablas) > 0
begin
    begin try
        select @tabla = tabla, @IdFormulario = IdFormulario from #tablas;
        -- seleccionar todos los campos del formulario no incluir gridForm, en caso de ser gridForm se debe crear una tabla por cada gridForm
        insert into #columnas (IdFormularioCampo, nombre, tipo, requerido, descripcion)
        select fc.IdFormularioCampo, concat('c_', right(concat('000000000000', fc.IdCampo), 12)), 
        case td.Nombre 
            when 'System.String' then 'nvarchar(1000)'
            when 'System.Int32' then 'int'
            when 'System.Int64' then 'bigint'
            when 'System.Decimal' then 'decimal'
            when 'System.Double' then 'float'
            when 'System.Boolean' then 'bit'
            when 'System.DateTime' then 'datetime'
            when 'System.Guid' then 'nvarchar(1000)'
            when 'System.Object' then 'nvarchar(1000)'
            else 'nvarchar(1000)'
        end, Requerido, c.Descripcion
        from db_biblioteca.FormularioCampo fc inner join db_biblioteca.Campo c on c.IdCampo = fc.IdCampo 
        inner join db_sistema.TipoDato td on c.IdTipoDato = td.IdTipoDato
        where fc.IdFormulario = @IdFormulario and fc.audRegistroEliminado = 0
        and c.[Control] not in ('gridForm');
        declare @columnas nvarchar(max), @script_create nvarchar(max), @script_alter nvarchar(max), @script_drop nvarchar(max),
        @script_count nvarchar(max), @count int;
        select @columnas = string_agg(concat('[', nombre, '] ', tipo), ', ') from #columnas;
        
        -- añadir los las descripciones como comentarios en la tabla
        declare @comentarios nvarchar(max);
        select @comentarios = string_agg(concat('comment on column db_biblioteca.', @tabla, '.', nombre, ' is ''', replace(descripcion, '''', ''''''), ''''), '; ') from #columnas
        where descripcion is not null and descripcion != '';
        --print @comentarios;
        --exec(@comentarios);

        -- si tabla existe pero no tiene datos, eliminarla y volver a crearla
        if object_id('db_biblioteca.' + @tabla) is not null
        begin
            set @script_count = concat('select @count = count(*) from db_biblioteca.', @tabla);
            exec [sp_executesql] @script_count, N'@count int output', @count output;
			print concat('Tiene registros ',  @count);
            if @count = 0
            begin
                set @script_drop = concat('drop table db_biblioteca.', @tabla);
                exec(@script_drop);
            end
        end 
        if object_id('db_biblioteca.' + @tabla) is not null 
        begin
            -- si existe la tabla, verificar insertar las columnas que no existen
            declare @columnas_no_existentes nvarchar(max);
            select @columnas_no_existentes = string_agg(concat('[', nombre, '] ', tipo), ', ') from #columnas where nombre not in (
                select [name] collate SQL_Latin1_General_CP1_CI_AS from sys.columns where object_id = object_id('db_biblioteca.' + @tabla)
            );
            if @columnas_no_existentes is not null
            begin
                set @script_alter = concat('alter table [db_biblioteca].[', @tabla, '] add ', @columnas_no_existentes);
                print @script_alter;
                exec(@script_alter);
            end
        end
        else
        begin
            set @script_create = concat('create table [db_biblioteca].[', @tabla, '] ([IdDatosMaterial] int identity(1,1) primary key, [IdFormulario] int, [IdMaterial] int, ', @columnas, ', [audRegistroEliminado] bit, [audFecCreacion] datetime, [audUsuCreacion] varchar(100), [audFecUltMod] datetime, [audUsuUltMod] varchar(100))');
            print @script_create;
            exec(@script_create);

        end
        -- verificar si existe la llave foreanea
        if object_id('db_biblioteca.FK_' + @tabla + '_Material') is null
        begin
            -- crear las llaves foraneas de la tabla
            declare @sql_fk nvarchar(max);
            set @sql_fk = concat('alter table [db_biblioteca].[', @tabla, '] add constraint [FK_', @tabla, '_Material] foreign key (IdMaterial) references db_biblioteca.Material (IdMaterial)');
            print @sql_fk;
            exec(@sql_fk);
        end

        --- se actualizan los nombres de columnas y tabla en el formulario y campos
        update db_biblioteca.FormularioCampo set FormularioCampo.TablaColumna = c.nombre from #columnas c where FormularioCampo.IdFormularioCampo = c.IdFormularioCampo;
        update db_biblioteca.Formulario set Tabla = @tabla where IdFormulario = @IdFormulario;

        delete from #tablas where tabla = @tabla;
        delete from #columnas;
    end try
    begin catch 
        print 'Error al crear la tabla ' + @tabla;
        print concat('Error: ', error_message(), ' Linea: ', error_line(), ' Numero: ', error_number(), ' Severidad: ', error_severity(), ' Estado: ', error_state());
        break;
    end catch;


end

end
