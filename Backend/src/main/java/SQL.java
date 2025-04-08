import javax.sql.rowset.*;
import java.io.*;
import java.sql.*;
import java.util.*;
import com.mysql.cj.jdbc.result.CachedResultSetMetaData;
import com.google.gson.*;

class SQL
{
    public static Connection connection = null;

    public SQL(String url, String username, String password)
    {
        try
        {
            Class.forName("com.mysql.cj.jdbc.Driver");
        }
        catch (ClassNotFoundException e)
        {
            System.out.println(e);
        }

        if (connection == null)
        {
            try
            {
                connection = DriverManager.getConnection(url, username, password);
            }
            catch (SQLException e)
            {
                System.out.println("Could not connect because: " + e);
            }
        }
        else
        {
            System.out.println("Connection already exists!");
        }
    }

    // Must use CachedRowSet since ResultSet is temporary and dies after try catch
    /**
     * @param query The MYSQL query
     * @return Returns a CachedRowSet of the query's ResultSet
     */
    public CachedRowSet executeQuery(String query)
    {
        RowSetFactory f = null;
        CachedRowSet c = null;
        ResultSet rs = null;

        try (PreparedStatement ps = connection.prepareStatement(query))
        {
            f = RowSetProvider.newFactory();
            rs = ps.executeQuery();
            c = f.createCachedRowSet();
            c.populate(rs);

            return c;
        }
        catch (SQLException | NullPointerException e)
        {
            System.out.println(e);
        }

        return c;
    }

    /**
     * @param query The MYSQL query
     * Executes an update, insert, or delete query
     * Returns false if something went wrong
     */
    public boolean executeUpdate(String query)
    {
        try (Statement st = connection.createStatement())
        {
            st.executeUpdate(query);
        }
        catch (SQLException | NullPointerException e)
        {
            System.out.println(e);
            return false;
        }

        return true;
    }

    /**
     * <p>Each line represents a tuple/row</p>
     * <p>Each comma separated entry is formatted as: value of col name of col</p>
     */
    public void printQueryResults(CachedRowSet rs)
    {
        try
        {
            // reset cursor to start
            // since CachedRowSet may be used more than once
            rs.beforeFirst();

            ResultSetMetaData meta = rs.getMetaData();
            int columnsNumber = meta.getColumnCount();
            while (rs.next())
            {
                for (int i = 1; i <= columnsNumber; i++)
                {
                    if (i > 1)
                    {
                        System.out.print(",  ");
                    }

                    String columnValue = rs.getString(i);
                    System.out.print(columnValue + " " + meta.getColumnName(i));
                }
                System.out.println();
            }
        }
        catch (SQLException e)
        {
            System.out.println(e);
        }
    }
}