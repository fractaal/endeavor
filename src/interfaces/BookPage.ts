export interface BookPage {
  title:    string;
  href:     string;
  level:    number;
  url:      string;
  content:  string;
  hidden:   string;
  subitems: BookPage[];
}
